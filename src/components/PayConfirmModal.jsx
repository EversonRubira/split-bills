
import { useState } from 'react'

export default function PayConfirmModal({ bill, paidBy, onConfirm, onClose }) {
  const [amount, setAmount] = useState(Number(bill.amount).toFixed(2))

  const handleConfirm = () => {
    onConfirm(bill, paidBy, parseFloat(amount))
    onClose()
  }

  return (
    <div style={styles.overlay} className="fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="fade-up">
        <div style={styles.handle} />

        <h2 style={styles.title}>Confirmar pagamento</h2>
        <p style={styles.subtitle}>
          <span style={{color: paidBy === 'Everson' ? 'var(--everson)' : 'var(--claudia)', fontWeight: 600}}>
            {paidBy}
          </span>
          {' pagou ' + bill.name}
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Valor pago (R$)</label>
          <input
            style={styles.input}
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
          <p style={styles.hint}>Valor base: R$ {Number(bill.amount).toFixed(2)}</p>
        </div>

        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            style={{...styles.confirmBtn, background: paidBy === 'Everson'
              ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
              : 'linear-gradient(135deg, #db2777, #be185d)'
            }}
            onClick={handleConfirm}
          >
            Confirmar
          </button>
        </div>
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
    zIndex: 200,
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
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginTop: '-8px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
    padding: '14px',
    color: 'var(--text)',
    fontSize: '22px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '500',
    width: '100%',
    textAlign: 'center',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
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
  confirmBtn: {
    flex: 2,
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}
