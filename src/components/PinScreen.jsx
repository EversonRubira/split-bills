import { useState } from 'react'

const PINS = {
  '1234': 'Everson',
  '5678': 'Claudia',
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
        <div style={styles.logo}>₂</div>
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
  },
  top: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    width: '64px',
    height: '64px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '8px',
    color: '#c8ff00',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
    color: '#f0f0f0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
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
    border: '2px solid #333',
    transition: 'all 0.15s ease',
  },
  dotFilled: {
    background: '#c8ff00',
    borderColor: '#c8ff00',
  },
  dotError: {
    borderColor: '#ff4444',
    background: '#ff4444',
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
    borderRadius: '16px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#f0f0f0',
    fontSize: '22px',
    fontWeight: '400',
    fontFamily: 'DM Sans, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {
    background: 'transparent',
    border: 'none',
    cursor: 'default',
  },
  keyDelete: {
    background: '#1a1a1a',
    color: '#666',
    fontSize: '18px',
  },
}
