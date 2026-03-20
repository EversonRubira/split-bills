import { useState } from 'react'

const PINS = {
  'XXXX': 'Everson',
  'YYYY': 'Claudia',
}

export default function PinScreen({ onLogin }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleKey = (key) => {
    if (pin.length >= 4) return
    const next = pin + key
    setPin(next)
    setError(false)

    if (next.length === 4) {
      setTimeout(() => {
        const user = PINS[next]
        if (user) {
          onLogin(user)
        } else {
          setShake(true)
          setError(true)
          setTimeout(() => {
            setPin('')
            setShake(false)
          }, 600)
        }
      }, 100)
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError(false)
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.top}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>₂</div>
        </div>
        <h1 style={styles.title}>Split Bills</h1>
        <p style={styles.subtitle}>Controle financeiro do casal</p>
      </div>

      <div style={{...styles.dots, ...(shake ? styles.shake : {})}}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            ...styles.dot,
            ...(i < pin.length ? styles.dotFilled : {}),
            ...(error ? styles.dotError : {}),
          }} />
        ))}
      </div>

      <div style={styles.keypad}>
        {keys.map((key, i) => (
          <button
            key={i}
            style={{
              ...styles.key,
              ...(key === '' ? styles.keyEmpty : {}),
              ...(key === '⌫' ? styles.keyDelete : {}),
            }}
            onClick={() => key === '⌫' ? handleDelete() : key !== '' ? handleKey(key) : null}
            disabled={key === ''}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    gap: '48px',
    background: 'linear-gradient(160deg, #f0f4f8 0%, #e8eef5 50%, #dde6f0 100%)',
  },
  top: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  logoWrap: {
    padding: '4px',
    background: 'linear-gradient(135deg, #2563eb22, #2563eb44)',
    borderRadius: '24px',
    marginBottom: '8px',
  },
  logo: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: 'white',
    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
    color: '#1a2332',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '300',
  },
  dots: {
    display: 'flex',
    gap: '16px',
  },
  shake: {
    animation: 'shake 0.5s ease',
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid #cbd5e1',
    background: 'white',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
  },
  dotFilled: {
    background: '#2563eb',
    borderColor: '#2563eb',
    boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
  },
  dotError: {
    borderColor: '#ef4444',
    background: '#ef4444',
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '280px',
  },
  key: {
    height: '72px',
    borderRadius: '20px',
    background: 'white',
    border: '1px solid #e2e8f0',
    color: '#1a2332',
    fontSize: '22px',
    fontWeight: '400',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  keyEmpty: {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'default',
  },
  keyDelete: {
    background: 'white',
    color: '#94a3b8',
    fontSize: '18px',
    border: '1px solid #e2e8f0',
  },
}
