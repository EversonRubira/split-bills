import { useState } from 'react'

export default function AddBillModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [day, setDay] = useState('1')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !amount) return
    setLoading(true)
    await onAdd({
      name,
      amount: parseFloat(amount),
      day_of_month: parseInt(day) || 1,
      end_date: endDate || null,
    })
    setLoading(false)
    onClose()
  }

  return (
    <div style={styles.overlay} className="fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="fade-up">
        <div style={styles.handle} />

        <h2 style={styles.title}>Nova conta</h2>
        <p style={styles.subtitle}>Será cobrada todo mês automaticamente</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nome</label>
            <input
              style={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Aluguel, Netflix..."
              required
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Valor (R$)</label>
            <input
              style={styles.input}
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div style={styles.row}>
            <div style={{...styles.field, flex: 1}}>
              <label style={styles.label}>Dia do vencimento</label>
              <input
                style={styles.input}
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={e => setDay(e.target.value)}
              />
            </div>
            <div style={{...styles.field, flex: 1}}>
              <label style={styles.label}>Data final (opcional)</label>
              <input
                style={styles.input}
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.buttons}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? '...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.4)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 100,
  },
  modal: {
    width: '100%',
    maxWidth: '430px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '28px 28px 0 0',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    padding: '16px 24px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 -8px 32px rgba(0,0,0,0.08)',
  },
  handle: {
    width: '36px',
    height: '4px',
    background: '#e2e8f0',
    borderRadius: '2px',
    margin: '0 auto 8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text)',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '-8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  label: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontWeight: '600',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono)',
  },
  input: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '12px 14px',
    color: 'var(--text)',
    fontSize: '15px',
    width: '100%',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '14px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: '15px',
    fontWeight: '500',
  },
  submitBtn: {
    flex: 2,
    padding: '14px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
  },
}
