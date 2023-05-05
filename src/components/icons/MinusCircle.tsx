interface ComponentPorps extends React.SVGProps<SVGSVGElement> {}

export default function MinusCircle({
  ...porps
}: ComponentPorps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-4 h-4 min-w-[16px] min-h-[16px] hover:scale-110 hover:cursor-pointer'
      {...porps}
    >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
  )
}
