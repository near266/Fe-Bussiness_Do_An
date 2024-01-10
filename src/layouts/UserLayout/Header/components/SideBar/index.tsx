export interface ISideBarProps {
  data?: 'TODO:Change me';
}

export function SideBar(props: ISideBarProps) {
  return (
    <aside className="side-bar  left-0 h-full w-sidebar transition-transform duration-700 ease pr-2 bg-white p-[10px] hide_scrollbar overflow-y-auto min-h-screen shadow-[inset_-1px_0px_0px_#DCDCE0] z-[var(--side-bar-zindex)]">
      sidebar
    </aside>
  );
}
