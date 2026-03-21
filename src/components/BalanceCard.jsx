export default function BalanceCard({ payments, bills = [], transfers = [], onAddTransfer, onDeleteTransfer }) {
  const eversonPaid = payments
    .filter(p => p.paid_by === 'Everson')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const claudiaPaid = payments
    .filter(p => p.paid_by === 'Claudia')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  // Transferências: quem enviou dinheiro tem crédito extra
  const eversonSent = transfers
    .filter(t => t.from_person === 'Everson')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const claudiaSent = transfers
    .filter(t => t.from_person === 'Claudia')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const eversonEffective = eversonPaid + eversonSent
  const claudiaEffective = claudiaPaid + claudiaSent

  const totalBills = bills.reduce((sum, b) => sum + Number(b.amount), 0)
  const fairShare = totalBills / 2

  // netOwed > 0 → Claudia deve para Everson; < 0 → Everson deve para Claudia
  // Transferências de Claudia quitam a dívida dela; transferências de Everson criam dívida nova
  const netOwed = eversonPaid - fairShare - claudiaSent + eversonSent
  const amount = Math.abs(netOwed)
  const debtor = netOwed > 0 ? 'Claudia' : 'Everson'
  const creditor = netOwed > 0 ? 'Everson' : 'Claudia'
  const balanced = amount < 0.01

  // % das barras: sobre o total de contas, incluindo transferências
  const eversonPct = totalBills > 0 ? Math.min((eversonEffective / totalBills) * 100, 100) : 0
  const claudiaPct = totalBills > 0 ? Math.min((claudiaEffective / totalBills) * 100, 100) : 0

  const eversonDone = eversonEffective >= fairShare - 0.01
  const claudiaDone = claudiaEffective >= fairShare - 0.01

  const total = eversonPaid + claudiaPaid

  return (
    <div style={styles.card} className="fade-up">
      <div style={styles.header}>
        <p style={styles.label}>RESUMO DO MÊS</p>
        <div style={styles.totalBadge}>
          <span style={styles.totalText}>Total: € {totalBills.toFixed(2)}</span>
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
          <div style={styles.barTrack}>
            <div style={{
              ...styles.barFill,
              width: `${eversonPct}%`,
              background: eversonDone
                ? 'linear-gradient(90deg, #059669, #10b981)'
                : 'linear-gradient(90deg, #93c5fd, #2563eb)',
            }} />
            <div style={styles.fairMark} />
          </div>
          <span style={{...styles.barValue, color: eversonDone ? 'var(--success)' : 'var(--everson)'}}>
            € {eversonEffective.toFixed(2)}
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
          <div style={styles.barTrack}>
            <div style={{
              ...styles.barFill,
              width: `${claudiaPct}%`,
              background: claudiaDone
                ? 'linear-gradient(90deg, #059669, #10b981)'
                : 'linear-gradient(90deg, #f9a8d4, #db2777)',
            }} />
            <div style={styles.fairMark} />
          </div>
          <span style={{...styles.barValue, color: claudiaDone ? 'var(--success)' : 'var(--claudia)'}}>
            € {claudiaEffective.toFixed(2)}
          </span>
        </div>

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
          <span style={styles.oweAmount}>€ {amount.toFixed(2)}</span>
          {' para '}
          <span style={{color: creditor === 'Everson' ? 'var(--everson)' : 'var(--claudia)', fontWeight: 600}}>
            {creditor}
          </span>
        </p>
      )}

      {/* Transferências registradas */}
      {transfers.length > 0 && (
        <div style={styles.transfersSection}>
          <p style={styles.transfersTitle}>ACERTOS</p>
          {transfers.map(t => (
            <div key={t.id} style={styles.transferRow}>
              <div style={styles.transferInfo}>
                <span style={{
                  ...styles.transferName,
                  color: t.from_person === 'Everson' ? 'var(--everson)' : 'var(--claudia)',
                }}>
                  {t.from_person}
                </span>
                <span style={styles.transferArrow}>→</span>
                <span style={{
                  ...styles.transferName,
                  color: t.to_person === 'Everson' ? 'var(--everson)' : 'var(--claudia)',
                }}>
                  {t.to_person}
                </span>
                {t.note ? <span style={styles.transferNote}> · {t.note}</span> : null}
              </div>
              <div style={styles.transferRight}>
                <span style={styles.transferAmount}>€ {Number(t.amount).toFixed(2)}</span>
                <button style={styles.deleteTransfer} onClick={() => onDeleteTransfer(t.id)}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de acerto */}
      <button style={styles.transferBtn} onClick={onAddTransfer}>
        + Registrar acerto
      </button>
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
    background: 'rgba(0,0,0,0.08)',
  },
  barFill: {
    height: '100%',
    borderRadius: '20px',
    transition: 'width 0.6s ease, background 0.4s ease',
  },
  fairMark: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '2px',
    height: '100%',
    background: 'rgba(0,0,0,0.2)',
    transform: 'translateX(-50%)',
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
  transfersSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'rgba(5,150,105,0.06)',
    borderRadius: '12px',
    padding: '12px',
  },
  transfersTitle: {
    fontSize: '9px',
    fontWeight: '700',
    color: 'var(--success)',
    letterSpacing: '1.5px',
    fontFamily: 'var(--font-mono)',
  },
  transferRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  transferInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    flexWrap: 'wrap',
  },
  transferName: {
    fontSize: '13px',
    fontWeight: '600',
  },
  transferArrow: {
    fontSize: '13px',
    color: 'var(--text-dim)',
  },
  transferNote: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontStyle: 'italic',
  },
  transferRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  transferAmount: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--success)',
    fontFamily: 'var(--font-mono)',
  },
  deleteTransfer: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-dim)',
    fontSize: '18px',
    lineHeight: 1,
    padding: '0 2px',
    cursor: 'pointer',
  },
  transferBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white',
    fontSize: '13px',
    fontWeight: '700',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.3px',
  },
}
