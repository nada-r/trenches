import ProfileIcon from '@/components/icons/ProfileIcon';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [title, setTitle] = useState('');

  const openProfile = () => {
    localStorage.setItem('previousPage', pathname);
    router.push('/profile');
  };

  useEffect(() => {
    // Update the page title based on the current path
    const pageTitle = getPageTitle(pathname);
    setTitle(pageTitle);
  }, [pathname]);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/ranking':
        return 'Ranking';
      case '/portfolio':
        return 'Portfolio';
      case '/market':
        return 'Market';
      case '/tournament':
        return 'Tournament';
      case '/profile':
        return 'Profile';
      default:
        return '';
    }
  };

  return (
    <header className="text-white py-4 px-6 relative">
      <div className="absolute top-4 left-6" onClick={openProfile}>
        <ProfileIcon />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
}
