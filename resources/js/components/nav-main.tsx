import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type NavItem } from '@/config/sidebar-menu';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

// Helper function untuk mendapatkan title halaman saat ini
function getCurrentPageTitle(url: string, items: NavItem[]): string {
  // Cari di menu utama
  for (const item of items) {
    if (item.href && url.startsWith(item.href)) {
      return item.title;
    }
    // Cari di submenu
    if (item.children) {
      for (const child of item.children) {
        if (child.href && url.startsWith(child.href)) {
          return `${item.title} › ${child.title}`;
        }
      }
    }
  }
  return 'Dashboard';
}

interface NavMainProps {
  items: NavItem[];
  isCollapsed?: boolean;
}

export function NavMain({ items, isCollapsed = false }: NavMainProps) {
  const { url } = usePage();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Cari tahu accordion mana yang harus aktif berdasarkan URL saat ini
  const findActiveParent = (items: NavItem[]): string | undefined => {
    for (const item of items) {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          child.href && url.startsWith(child.href)
        );
        if (hasActiveChild) {
          return item.title;
        }
      }
    }
    return undefined;
  };

  const activeParent = findActiveParent(items);

  // Inisialisasi state dengan active parent
  useEffect(() => {
    if (activeParent) {
      setOpenItems(new Set([activeParent]));
    }
  }, [activeParent]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: NavItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href ? url.startsWith(item.href) : false;
    const isOpen = openItems.has(item.title);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <div className="relative">
            <CollapsibleTrigger asChild>
              <button
                className={`group relative w-full py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center gap-3 text-left ${
                  isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                {Icon && (
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                )}
                {!isCollapsed && <span className="flex-1 text-sm truncate">{item.title}</span>}
                {!isCollapsed && (
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pb-2 pt-1">
              <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-3 space-y-1">
                {item.children?.map((child, childIndex) => {
                  const ChildIcon = child.icon;
                  const isChildActive = url.startsWith(child.href || '');

                  return (
                    <div
                      key={child.title}
                      className={`transform transition-all duration-300 ease-out ${
                        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                      }`}
                      style={{
                        transitionDelay: `${childIndex * 50}ms`,
                      }}
                    >
                      <Link 
                        href={child.href || '#'} 
                        className={`group relative w-full transition-all duration-200 hover:translate-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 py-1.5 px-3 rounded-lg ${
                          isChildActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-400'
                        }`}
                        title={isCollapsed ? child.title : undefined}
                      >
                        {ChildIcon && (
                          <ChildIcon className="h-3 w-3 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                        )}
                        {!isCollapsed && <span className="flex-1 text-xs text-left truncate">{child.title}</span>}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      );
    }

    return (
      <div key={item.title}>
        <Link 
          href={item.href || '#'} 
          className={`group relative w-full transition-all duration-200 hover:translate-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 py-2 px-3 rounded-lg ${
            isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
          }`}
          title={isCollapsed ? item.title : undefined}
        >
          {Icon && <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />}
          {!isCollapsed && <span className="flex-1 text-sm text-left truncate">{item.title}</span>}
        </Link>
      </div>
    );
  };

  return (
    <div className="p-2">
      <div className="relative">
        <div className="relative">
          <div className="space-y-1">
            {items.map((item, index) => (
              <div
                key={item.title}
                className={`relative transition-all duration-300 ease-out ${
                  openItems.has(item.title) ? 'mb-2' : 'mb-1'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                {renderMenuItem(item, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
