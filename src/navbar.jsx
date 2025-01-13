
import { Link } from 'react-router-dom';
function navbar() {
  

  return (
    <>
    <nav className="sticky top-0 bg-p3 z-[20] mx-auto py-6 flex w-full items-center justify-between px-7">
    <ul><Link to="/" className="text-2xl font-bold text-p1 ">Home</Link></ul>
    </nav>
    </>
  )
}

export default navbar