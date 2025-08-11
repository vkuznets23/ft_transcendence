export default function Lightning() {
  return (
    <div
      className="
        w-10 h-20 
        bg-lightningYellow 
        clip-path-lightning 
        drop-shadow-yellow 
        animate-strike
        mx-auto
      "
      style={{
        clipPath:
          'polygon(40% 0%, 60% 0%, 50% 30%, 70% 30%, 30% 100%, 40% 60%, 20% 60%, 50% 0%)',
      }}
    ></div>
  )
}
