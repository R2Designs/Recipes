import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Splash } from '@/components/splash/Splash'
import { AppShell } from '@/components/layout/AppShell'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import RecipeDetail from '@/pages/RecipeDetail'
import Ingredients from '@/pages/Ingredients'
import Cart from '@/pages/Cart'
import OrderSuccess from '@/pages/OrderSuccess'
import NotFound from '@/pages/NotFound'

/** Route changes should start at the top — the browser won't do it for an SPA. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Braces are load-bearing here, not style: an arrow with an implicit
    // return hands whatever `scrollTo` returns to React as the effect's
    // cleanup function. It's `undefined` in a clean browser, but at least
    // one real environment (seen via automation, plausible from an
    // extension that patches `scrollTo`) returned `{}` instead — a
    // non-function truthy value blows up on unmount with "destroy is not
    // a function" and blanks the whole page. Discard the return explicitly.
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  // The title sequence plays once per page load, and only when arriving at
  // the homepage — landing deep (a shared recipe link) should go straight
  // there.
  const { pathname } = useLocation()
  const [introDone, setIntroDone] = useState(() => pathname !== '/')

  return (
    <AppShell>
      {!introDone && <Splash onDone={() => setIntroDone(true)} />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recipe/:slug" element={<RecipeDetail />} />
        <Route path="/recipe/:slug/ingredients" element={<Ingredients />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}
