import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BalanceCard from '../components/BalanceCard'
import BillCard from '../components/BillCard'
import AddBillModal from '../components/AddBillModal'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function Dashboard({ user, onLogout }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [bills, setBills] = useState([])
  const [payments, setPayments] = useState([])
  const [allPayments, setAllPayments] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBills() }, [])
  useEffect(() => { fetchPayments() }, [month, year])
  useEffect(() => { fetchAllPayments() }, [])

  const fetchBills = async () => {
    const { data } = await supabase.from('bills').select('*').eq('is_active', true).order('name')
    setBills(data || [])
    setLoading(false)
  }

  const fetchPayments = async () => {
    const { data } = await supabase.from('payments').select('*').eq('month', month).eq('year', year)
    setPayments(data || [])
  }

  const fetchAllPayments = async () => {
    const { data } = await supabase.from('payments').select('*')
    setAllPayments(data || [])
  }

  const activeBills = bills.filter(bill => {
    const start = new Date(bill.start_date)
    const billStart = new Date(start.getFullYear(), start.getMonth())
    const current = new Date(year, month - 1)
    if (current < billStart) return false
    if (bill.end_date) {
      const end = new Date(bill.end_date)
      const billEnd = new Date(end.getFullYear(), end.getMonth())
      if (current > billEnd) return false
    }
    return true
  })

  const handleAddBill = async (bill) => {
    const { data } = await supabase.from('bills').insert(bill).select().single()
    if (data) setBills(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)))
  }

 const handlePay = async (bill, paidBy, amount) => {
    const { data } = await supabase.from('payments').insert({
      bill_id: bill.id,
      bill_name: bill.name,
      amount: amount,
      paid_by: paidBy,
      month,
      year,
    }).select().single()
    if (data) {
      setPayments(prev => [...prev, data])
      setAllPayments(prev => [...prev, data])
    }
  }

  const handleUndoPay = async (id) => {
    await supabase.from('payments').delete().eq('id', id)
    setPayments(prev => prev.filter(p => p.id !== id))
    setAllPayments(prev => prev.filter(p => p.id !== id))
  }

  const handleDelete = async (id) => {
    await supabase.from('bills').delete().eq('id', id)
    setBills(prev => prev.filter(b => b.id !== id))
  }

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const paidCount = activeBills.filter(b => payments.find(p => p.bill_id === b.id)).length

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>💰</span>
          <div>
            <p style={styles.headerTitle}>Split Bills</p>
            <p style={styles.headerUser}>{user}</p>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>sair</button>
      </header>

      <div style={styles.monthNav}>
        <button style={styles.navBtn} onClick={prevMonth}>‹</button>
        <div style={styles.monthInfo}>
          <span style={styles.monthName}>{MONTHS[month-1]} {year}</span>
          <span style={styles.progress}>{paidCount}/{activeBills.length} pagas</span>
        </div>
        <button style={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      <div style={styles.content}>
        <BalanceCard payments={payments} bills={activeBills} />

        <div style={styles.sectionHeader}>
          <p style={styles.sectionTitle}>CONTAS DO MÊS</p>
          <button style={styles.addBtn} onClick={() => setShowAdd(true)}>+ nova</button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            {[1,2,3].map(i => <div key={i} style={styles.skeleton} />)}
          </div>
        ) : activeBills.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>💰</p>
            <p style={styles.emptyText}>Nenhuma conta cadastrada</p>
            <p style={styles.emptySubtext}>Adicione uma conta para começar</p>
          </div>
        ) : (
          <div style={styles.billsList}>
            {activeBills.map(bill => (
              <BillCard
                key={bill.id}
                bill={bill}
                payment={payments.find(p => p.bill_id === bill.id)}
                onPay={handlePay}
                onUndoPay={handleUndoPay}
                onDelete={handleDelete}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddBillModal onAdd={handleAddBill} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(160deg, #f0f4f8 0%, #e8eef5 50%, #dde6f0 100%)',
  },
 header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    position: 'sticky',
    top: 0,
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    zIndex: 10,
  },
  
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text)',
    lineHeight: 1.2,
  },
  headerUser: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    background: 'white',
    color: 'var(--text-muted)',
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  monthNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  
  navBtn: {
    background: 'white',
    color: 'var(--text-muted)',
    fontSize: '20px',
    padding: '6px 12px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    lineHeight: 1,
  },
  monthInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  monthName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text)',
  },
  progress: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
  },
  content: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
    fontFamily: 'var(--font-mono)',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
  },
  billsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  skeleton: {
    height: '120px',
    borderRadius: 'var(--radius)',
    background: 'white',
    opacity: 0.6,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  emptyIcon: {
    fontSize: '40px',
    color: 'var(--text-dim)',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: '13px',
    color: 'var(--text-dim)',
  },
}
