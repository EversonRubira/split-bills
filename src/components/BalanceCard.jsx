export default function BalanceCard({ payments }) {
  const eversonPaid = payments
    .filter(p => p.paid_by === 'Everson')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const claudiaPaid = payments
    .filter(p => p.paid_by === 'Claudia')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const total = eversonPaid + claudiaPaid
  const fairShare = total / 2
  const diff = eversonPaid - fairShare
  const amount = Math.abs(diff)
  const debtor = diff > 0 ? 'Claudia' : 'Everson'
  const creditor = diff > 0 ? 'Everson' : 'Claudia'
  const balanced = amount < 0.01

  return (
    <div style={styles.card} className="fade-up">
      <div style={styles.header}>
        <p style={styles.label}>SALDO GERAL</p>
        <div style={styles.totalBadge}>
          <span style={styles.totalText}>Total: R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.person}>
          <div style={{...styles.dot, background: 'rgba(37,99,235,0.1)'}}>
            <span style={{color: 'var(--everson)', fontSize: '12px', fontWeight: '600'}}>E</span>
          </div>
          <span style={styles.name}>Everson</span>
          <span style={{...styles.amount, color: 'var(--everson)'}}>
            R$ {eversonPaid.toFixed(2)}
          </span>
        </div>
        <div style={styles.divider} />
        <div style={{...styles.person, alignItems: 'flex-end'}}>
          <div style={{...styles.dot, background: 'rgba(219,39,119,0.1)'}}>
            <span style={{color: 'var(--claudia)', fontSize: '12px', fontWeight: '600'}}>C</span>
          </div>
          <span style={styles.name}>Claudia</span>
          <span style={{...styles.amount, color: 'var(--claudia)'}}>
            R$ {claudiaPaid.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={styles.separator} />

      {balanced ? (
        <p style={styles.balanced}>✦ Tudo equilibrado</p>
      ) : (
        <p style={styles.owe}>
          <span style={{color: debtor === 'Everson' ? 'var(--everson)' : 'var(--claudia)', fontWeight: 600}}>
            {debtor}
          </span>
          {' deve '}
          <span style={styles.oweAmount}>R$ {amount.toFixed(2)}</span>
          {' para '}
          <span style={{color: creditor === 'Everson' ? 'var(--everson)' : 'var(--claudia)', fontWeight: 600}}>
            {creditor}
          </span>
        </p>
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
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: 'var(--shadow)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
    fontFamily: 'var(--font-mono)',
  },
  totalBadge: {
    background: 'var(--accent-light)',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  totalText: {
    fontSize: '11px',
    color: 'var(--accent)',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  person: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  dot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '400',
  },
  amount: {
    fontSize: '22px',
    fontWeight: '500',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-0.5px',
  },
  divider: {
    width: '1px',
    height: '60px',
    background: 'var(--border)',
  },
  separator: {
    height: '1px',
    background: 'var(--border)',
  },
  balanced: {
    textAlign: 'center',
    color: 'var(--success)',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  owe: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  oweAmount: {
    color: 'var(--text)',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
  },
}
