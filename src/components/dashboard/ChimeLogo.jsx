export default function ChimeLogo({ className = "w-32" }) {
  return (
    <svg viewBox="0 0 200 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="600" fill="#25D366" letterSpacing="-1">
        chime
      </text>
      <circle cx="180" cy="20" r="3" fill="#25D366"/>
    </svg>
  );
}