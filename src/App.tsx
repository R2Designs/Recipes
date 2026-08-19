import { Routes, Route, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Splash } from '@/components/splash/Splash'
import { AppShell } from '@/components/layout/AppShell'
import { RecipeModal } from '@/components/recipe/RecipeModal'
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
  // there. Deliberately `useLocation()`, not `window.location.pathname`:
  // BrowserRouter's `basename` already strips the deployment prefix
  // ('/Recipes' on GitHub Pages), so this reads '/' at the true site root
  // on every deployment target without needing to know the prefix itself.
  const { pathname } = useLocation()
  const [introDone, setIntroDone] = useState(() => pathname !== '/')

  const location = useLocation()
  // A recipe link opened in-app stashes the page it was clicked from as
  // `state.backgroundLocation` (see RecipeCard/CollectionRow/Hero). When
  // present, the main <Routes> renders THAT location — keeping the grid
  // mounted and scrolled where it was — while a second <Routes> renders the
  // modal on top at the real (current) location. A direct link, a shared
  // URL, or a hard refresh carries no state, so backgroundLocation is
  // undefined and /recipe/:slug just renders the full page normally.
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)
    ?.backgroundLocation

  return (
    <AppShell>
      {!introDone && <Splash onDone={() => setIntroDone(true)} />}
      <ScrollToTop />
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recipe/:slug" element={<RecipeDetail />} />
        <Route path="/recipe/:slug/ingredients" element={<Ingredients />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="/recipe/:slug" element={<RecipeModal />} />
        </Routes>
      )}
    </AppShell>
  )
}
