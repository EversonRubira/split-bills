import { useState } from 'react'
import PayConfirmModal from './PayConfirmModal'

export default function BillCard({ bill, payment, onPay, onUndoPay, onDelete }) {
  const [confirm, setConfirm] = useState(false)
  const [payConfirm, setPayConfirm] = useState(null)
  const isPaid = !!payment

  return (
    <div style={{...styles.card, ...(isPaid ? styles.cardPaid : {})}} className="fade-up">
      <div style={styles.top}>
        <div style={styles.info}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{bill.name}</span>
            {isPaid && <span style={styles.badge}>pago</span>}
          </div>
          <span style={styles.due}>vence dia {bill.day_of_month}</span>
        </div>
        <div style={styles.right}>
          <span style={styles.amount}>€ {isPaid ? Number(payment.amount).toFixed(2) : Number(bill.amount).toFixed(2)}</span>
          <span style={styles.split}>€ {((isPaid ? Number(payment.amount) : Number(bill.amount)) / 2).toFixed(2)} cada</span>
        </div>
      </div>

      <div style={styles.separator} />

      {isPaid ? (
        <div style={styles.paidRow}>
          <span style={styles.paidBy}>
            pago por{' '}
            <span style={{color: payment.paid_by === 'Everson' ? 'var(--everson)' : 'var(--claudia)', fontWeight: 600}}>
              {payment.paid_by}
            </span>
          </span>
          <button style={styles.undoBtn} onClick={() => onUndoPay(payment.id)}>
            desfazer
          </button>
        </div>
      ) : (
        <div style={styles.actions}>
          <button
            style={{...styles.payBtn, ...styles.payEverson}}
            onClick={() => setPayConfirm('Everson')}
          >
            Everson pagou
          </button>
          <button
            style={{...styles.payBtn, ...styles.payClaudia}}
            onClick={() => setPayConfirm('Claudia')}
          >
            Claudia pagou
          </button>
        </div>
      )}

      {!isPaid && (
        confirm ? (
          <div style={styles.confirmRow}>
            <span style={styles.confirmText}>Remover esta conta?</span>
            <div style={styles.confirmBtns}>
              <button style={styles.confirmNo} onClick={() => setConfirm(false)}>não</button>
              <button style={styles.confirmYes} onClick={() => { onDelete(bill.id); setConfirm(false) }}>sim</button>
            </div>
          </div>
        ) : (
          <button style={styles.deleteBtn} onClick={() => setConfirm(true)}>
            remover conta
          </button>
        )
      )}

      {payConfirm && (
        <PayConfirmModal
          bill={bill}
          paidBy={payConfirm}
          onConfirm={(bill, paidBy, amount) => onPay(bill, paidBy, amount)}
          onClose={() => setPayConfirm(null)}
        />
      )}
    </div>
  )
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--shadow)',
    transition: 'all 0.2s ease',
  },
  cardPaid: {
    borderColor: 'rgba(16,185,129,0.3)',
    background: 'rgba(240,253,248,0.85)',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  name: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--text)',
  },
  badge: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--success)',
    background: 'rgba(16,185,129,0.1)',
    padding: '2px 8px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
    fontFamily: 'var(--font-mono)',
  },
  due: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  amount: {
    fontSize: '17px',
    fontWeight: '600',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  },
  split: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
  },
  separator: {
    height: '1px',
    background: 'rgba(0,0,0,0.06)',
  },
  paidRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidBy: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  payBtn: {
    flex: 1,
    padding: '11px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid transparent',
  },
  payEverson: {
    background: 'rgba(37,99,235,0.08)',
    color: 'var(--everson)',
    borderColor: 'rgba(37,99,235,0.15)',
  },
  payClaudia: {
    background: 'rgba(219,39,119,0.08)',
    color: 'var(--claudia)',
    borderColor: 'rgba(219,39,119,0.15)',
  },
  undoBtn: {
    background: 'none',
    color: 'var(--text-dim)',
    fontSize: '11px',
    padding: '0',
    letterSpacing: '0.3px',
    textDecoration: 'underline',
  },
  deleteBtn: {
    background: 'none',
    color: 'var(--text-dim)',
    fontSize: '11px',
    padding: '0',
    textAlign: 'left',
    letterSpacing: '0.3px',
  },
  confirmRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  confirmBtns: {
    display: 'flex',
    gap: '8px',
  },
  confirmNo: {
    background: 'rgba(255,255,255,0.6)',
    color: 'var(--text-muted)',
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  confirmYes: {
    background: 'rgba(239,68,68,0.08)',
    color: 'var(--danger)',
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(239,68,68,0.15)',
  },
}
