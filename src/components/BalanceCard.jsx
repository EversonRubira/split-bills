export default function BalanceCard({ payments, bills = [] }) {
  const eversonPaid = payments
    .filter(p => p.paid_by === 'Everson')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const claudiaPaid = payments
    .filter(p => p.paid_by === 'Claudia')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const totalBills = bills.reduce((sum, b) => sum + Number(b.amount), 0)
  const fairShare = totalBills / 2

  const diff = eversonPaid - fairShare
  const amount = Math.abs(diff)
  const debtor = diff > 0 ? 'Claudia' : 'Everson'
  const creditor = diff > 0 ? 'Everson' : 'Claudia'
  const balanced = amount < 0.01

  const eversonPct = fairShare > 0 ? Math.min((eversonPaid / fairShare) * 100, 100) : 0
  const claudiaPct = fairShare > 0 ? Math.min((claudiaPaid / fairShare) * 100, 100) : 0
  const eversonDone = fairShare > 0 && eversonPaid >= fairShare - 0.01
  const claudiaDone = fairShare > 0 && claudiaPaid >= fairShare - 0.01

  const total = eversonPaid + claudiaPaid

  return (
    <div style={styles.card} className="fade-up">
      <div style={styles.header}>
        <p style={styles.label}>RESUMO DO MÊS</p>
        <div style={styles.totalBadge}>
          <span style={styles.totalText}>Total: R$ {totalBills.toFixed(2)}</span>
        </div>
      </div>

      {/* Barras */}
      <div style={styles.bars}>

        {/* Everson */}
        <div style={styles.barRow}>
          <div style={styles.barInfo}>
            <div style={styles.personDot}>
              <span style={{color: 'var(--everson)', fontSize: '11px', fontWeight: '700'}}>E</span>
            </div>
            <span style={styles.barName}>Everson</span>
          </div>
          <div style={{
            ...styles.barTrack,
            background: eversonDone ? 'rgba(37,99,235,0.12)' : 'rgba(0,0,0,0.06)',
          }}>
            <div style={{
              ...styles.barFill,
              width: `${eversonPct}%`,
              background: eversonDone
                ? 'linear-gradient(90deg, #2563eb, #60a5fa)'
                : 'linear-gradient(90deg, #93c5fd, #bfdbfe)',
            }} />
          </div>
          <span style={{...styles.barValue, color: eversonDone ? 'var(--everson)' : 'var(--text-dim)'}}>
            R$ {eversonPaid.toFixed(2)}
            {eversonDone && <span style={styles.checkMark}> ✓</span>}
          </span>
        </div>

        {/* Claudia */}
        <div style={styles.barRow}>
          <div style={styles.barInfo}>
            <div style={{...styles.personDot, background: 'rgba(219,39,119,0.1)'}}>
              <span style={{color: 'var(--claudia)', fontSize: '11px', fontWeight: '700'}}>C</span>
            </div>
            <span style={styles.barName}>Claudia</span>
          </div>
          <div style={{
            ...styles.barTrack,
            background: claudiaDone ? 'rgba(219,39,119,0.12)' : 'rgba(0,0,0,0.06)',
          }}>
            <div style={{
              ...styles.barFill,
              width: `${claudiaPct}%`,
              background: claudiaDone
                ? 'linear-gradient(90deg, #db2777, #f472b6)'
                : 'linear-gradient(90deg, #f9a8d4, #fce7f3)',
            }} />
          </div>
          <span style={{...styles.barValue, color: claudiaDone ? 'var(--claudia)' : 'var(--text-dim)'}}>
            R$ {claudiaPaid.toFixed(2)}
            {claudiaDone && <span style={styles.checkMark}> ✓</span>}
          </span>
        </div>

        {/* Meta por pessoa */}
        {fairShare > 0 && (
          <div style={styles.fairLegend}>
            <div style={styles.fairDash} />
            <span style={styles.fairText}>meta: R$ {fairShare.toFixed(2)} cada</span>
            <div style={styles.fairDash} />
          </div>
        )}
      </div>

      <div style={styles.separator} />

      {totalBills === 0 ? (
        <p style={styles.balanced}>Nenhuma conta cadastrada</p>
      ) : total === 0 ? (
        <p style={styles.balanced}>Nenhum pagamento este mês</p>
      ) : balanced ? (
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
  bars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  barInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '70px',
    flexShrink: 0,
  },
  personDot: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'rgba(37,99,235,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  barName: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  barTrack: {
    flex: 1,
    height: '10px',
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'background 0.4s ease',
  },
  barFill: {
    height: '100%',
    borderRadius: '20px',
    transition: 'width 0.6s ease, background 0.4s ease',
    minWidth: '4px',
  },
  barValue: {
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
    minWidth: '80px',
    textAlign: 'right',
    transition: 'color 0.4s ease',
  },
  checkMark: {
    color: 'var(--success)',
  },
  fairLegend: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '-4px',
  },
  fairDash: {
    flex: 1,
    height: '1px',
    background: 'rgba(0,0,0,0.1)',
  },
  fairText: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
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
