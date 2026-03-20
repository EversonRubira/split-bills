import { useState, useEffect } from 'react'

export default function PinScreen({ onLogin }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [mode, setMode] = useState('loading')
  const [userName, setUserName] = useState(null)
  const [newPin, setNewPin] = useState('')

  useEffect(() => {
    const eversonPin = localStorage.getItem('pin_Everson')
    const claudiaPin = localStorage.getItem('pin_Claudia')
    if (!eversonPin && !claudiaPin) {
      setMode('setup_name')
    } else {
      setMode('login')
    }
  }, [])

  const handleKey = (key) => {
    if (pin.length >= 4) return
    const next = pin + key
    setPin(next)
    setError(false)

    if (next.length === 4) {
      setTimeout(() => {
        if (mode === 'setup_pin') {
          setNewPin(next)
          setPin('')
          setMode('confirm_pin')
          return
        }

        if (mode === 'confirm_pin') {
          if (next === newPin) {
            localStorage.setItem(`pin_${userName}`, next)
            onLogin(userName)
          } else {
            setShake(true)
            setError(true)
            setTimeout(() => { setPin(''); setShake(false) }, 600)
          }
          return
        }

        if (mode === 'login') {
          const eversonPin = localStorage.getItem('pin_Everson')
          const claudiaPin = localStorage.getItem('pin_Claudia')
          if (next === eversonPin) return onLogin('Everson')
          if (next === claudiaPin) return onLogin('Claudia')
          setShake(true)
          setError(true)
          setTimeout(() => { setPin(''); setShake(false) }, 600)
        }
      }, 100)
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError(false)
  }

  const handleSelectName = (name) => {
    setUserName(name)
    setMode('setup_pin')
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  const getTitle = () => {
    if (mode === 'setup_name') return 'Quem és tu? O Everson ou a Chata?'
    if (mode === 'setup_pin') return `Olá, ${userName}! Cria o teu PIN`
    if (mode === 'confirm_pin') return 'Confirma o PIN'
    return 'Bem-vindo de volta'
  }

  const getSubtitle = () => {
    if (mode === 'setup_name') return 'Primeira configuração'
    if (mode === 'setup_pin') return 'Define um PIN de 4 dígitos'
    if (mode === 'confirm_pin') return 'Repete o PIN para confirmar'
    return 'Introduz o teu PIN'
  }

  if (mode === 'loading') return null

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.top}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>₂</div>
        </div>
        <h1 style={styles.title}>{getTitle()}</h1>
        <p style={styles.subtitle}>{getSubtitle()}</p>
      </div>

      {mode === 'setup_name' ? (
        <div style={styles.nameButtons}>
          <button style={styles.nameBtn} onClick={() => handleSelectName('Everson')}>
            <span style={styles.nameInitial}>E</span>
            <span style={styles.nameBtnText}>Everson</span>
          </button>
          <button style={{...styles.nameBtn, ...styles.nameBtnClaudia}} onClick={() => handleSelectName('Claudia')}>
            <span style={{...styles.nameInitial, color: 'var(--claudia)'}}>C</span>
            <span style={styles.nameBtnText}>Claudia</span>
          </button>
        </div>
      ) : (
        <>
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

          {mode === 'login' && (
            <button style={styles.resetBtn} onClick={() => setMode('setup_name')}>
              Primeiro acesso / Redefinir PIN
            </button>
          )}
        </>
      )}
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
  nameButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '280px',
  },
  nameBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 24px',
    borderRadius: '20px',
    background: 'white',
    border: '1px solid rgba(37,99,235,0.2)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  },
  nameBtnClaudia: {
    border: '1px solid rgba(219,39,119,0.2)',
  },
  nameInitial: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(37,99,235,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--everson)',
  },
  nameBtnText: {
    fontSize: '17px',
    fontWeight: '500',
    color: '#1a2332',
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
  resetBtn: {
    background: 'none',
    color: '#94a3b8',
    fontSize: '13px',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}
