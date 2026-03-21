import { useState } from 'react'

export default function TransferModal({ currentUser, onAdd, onClose }) {
  const [from, setFrom] = useState(currentUser)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const to = from === 'Everson' ? 'Claudia' : 'Everson'

  const handleSubmit = async () => {
    const val = parseFloat(amount.replace(',', '.'))
    if (!val || val <= 0) return
    setLoading(true)
    await onAdd({ from_person: from, to_person: to, amount: val, note })
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()} className="fade-up">
        <p style={styles.title}>Registrar Transferência</p>
        <p style={styles.subtitle}>Acerto direto entre vocês</p>

        {/* Quem enviou */}
        <div style={styles.field}>
          <p style={styles.label}>QUEM ENVIOU</p>
          <div style={styles.toggle}>
            {['Everson', 'Claudia'].map(name => (
              <button
                key={name}
                style={{
                  ...styles.toggleBtn,
                  background: from === name
                    ? (name === 'Everson' ? 'var(--everson)' : 'var(--claudia)')
                    : 'transparent',
                  color: from === name ? 'white' : 'var(--text-muted)',
                  border: from === name ? 'none' : '1px solid var(--border)',
                }}
                onClick={() => setFrom(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Seta visual */}
        <div style={styles.arrow}>
          <span style={{...styles.arrowFrom, color: from === 'Everson' ? 'var(--everson)' : 'var(--claudia)'}}>
            {from}
          </span>
          <span style={styles.arrowIcon}>→</span>
          <span style={{...styles.arrowTo, color: to === 'Everson' ? 'var(--everson)' : 'var(--claudia)'}}>
            {to}
          </span>
        </div>

        {/* Valor */}
        <div style={styles.field}>
          <p style={styles.label}>VALOR ENVIADO</p>
          <div style={styles.amountRow}>
            <span style={styles.currency}>€</span>
            <input
              style={styles.input}
              type="number"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Nota opcional */}
        <div style={styles.field}>
          <p style={styles.label}>OBSERVAÇÃO (OPCIONAL)</p>
          <input
            style={{ ...styles.input, width: '100%', boxSizing: 'border-box', paddingLeft: '12px' }}
            type="text"
            placeholder="ex: acerto de março"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button
            style={{
              ...styles.confirmBtn,
              opacity: loading || !amount ? 0.6 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading || !amount}
          >
            {loading ? '...' : 'Confirmar'}
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
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 100,
    padding: '0',
  },
  modal: {
    background: 'white',
    borderRadius: '24px 24px 0 0',
    padding: '28px 24px 36px',
    width: '100%',
    maxWidth: '430px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--text)',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    textAlign: 'center',
    marginTop: '-12px',
  },
  label: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
    fontFamily: 'var(--font-mono)',
    marginBottom: '8px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  toggle: {
    display: 'flex',
    gap: '8px',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  arrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    background: 'var(--accent-light)',
    borderRadius: '12px',
    padding: '12px',
  },
  arrowFrom: {
    fontSize: '14px',
    fontWeight: '700',
  },
  arrowIcon: {
    fontSize: '18px',
    color: 'var(--text-dim)',
  },
  arrowTo: {
    fontSize: '14px',
    fontWeight: '700',
  },
  amountRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '10px 14px',
    background: 'var(--bg)',
  },
  currency: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid var(--border)',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  confirmBtn: {
    flex: 2,
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #059669, #10b981)',
    fontSize: '15px',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
  },
}
