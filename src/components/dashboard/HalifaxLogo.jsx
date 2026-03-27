export default function HalifaxLogo({ className = "w-24" }) {
  return (
    <svg viewBox="0 0 650 400" className={className}>
      {/* Top left stripes */}
      <g>
        <line x1="150" y1="95" x2="350" y2="95" stroke="#1e2875" strokeWidth="8"/>
        <line x1="155" y1="110" x2="345" y2="110" stroke="#1e2875" strokeWidth="8"/>
        <line x1="160" y1="125" x2="340" y2="125" stroke="#1e2875" strokeWidth="8"/>
        <line x1="165" y1="140" x2="335" y2="140" stroke="#1e2875" strokeWidth="8"/>
        <line x1="170" y1="155" x2="330" y2="155" stroke="#1e2875" strokeWidth="8"/>
        <line x1="175" y1="170" x2="325" y2="170" stroke="#1e2875" strokeWidth="8"/>
      </g>
      
      {/* Top right stripes */}
      <g>
        <line x1="300" y1="95" x2="500" y2="95" stroke="#1e2875" strokeWidth="8"/>
        <line x1="305" y1="110" x2="495" y2="110" stroke="#1e2875" strokeWidth="8"/>
        <line x1="310" y1="125" x2="490" y2="125" stroke="#1e2875" strokeWidth="8"/>
        <line x1="315" y1="140" x2="485" y2="140" stroke="#1e2875" strokeWidth="8"/>
        <line x1="320" y1="155" x2="480" y2="155" stroke="#1e2875" strokeWidth="8"/>
        <line x1="325" y1="170" x2="475" y2="170" stroke="#1e2875" strokeWidth="8"/>
      </g>
      
      {/* HALIFAX text */}
      <text x="325" y="250" fontSize="90" fontWeight="900" fill="#1e2875" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" letterSpacing="2">
        HALIFAX
      </text>
      
      {/* Bottom left stripes */}
      <g>
        <line x1="150" y1="280" x2="350" y2="280" stroke="#1e2875" strokeWidth="8"/>
        <line x1="155" y1="295" x2="345" y2="295" stroke="#1e2875" strokeWidth="8"/>
        <line x1="160" y1="310" x2="340" y2="310" stroke="#1e2875" strokeWidth="8"/>
        <line x1="165" y1="325" x2="335" y2="325" stroke="#1e2875" strokeWidth="8"/>
        <line x1="170" y1="340" x2="330" y2="340" stroke="#1e2875" strokeWidth="8"/>
        <line x1="175" y1="355" x2="325" y2="355" stroke="#1e2875" strokeWidth="8"/>
      </g>
      
      {/* Bottom right stripes */}
      <g>
        <line x1="300" y1="280" x2="500" y2="280" stroke="#1e2875" strokeWidth="8"/>
        <line x1="305" y1="295" x2="495" y2="295" stroke="#1e2875" strokeWidth="8"/>
        <line x1="310" y1="310" x2="490" y2="310" stroke="#1e2875" strokeWidth="8"/>
        <line x1="315" y1="325" x2="485" y2="325" stroke="#1e2875" strokeWidth="8"/>
        <line x1="320" y1="340" x2="480" y2="340" stroke="#1e2875" strokeWidth="8"/>
        <line x1="325" y1="355" x2="475" y2="355" stroke="#1e2875" strokeWidth="8"/>
      </g>
    </svg>
  );
}