import React from 'react';
import cn from 'clsx';
import { DirectoryTree } from '@/types';
import { arraysEqual } from '@/utils/array.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  tree: DirectoryTree;
  onSelectCategory: (a: string[]) => void;
  parent?: string[];
  activeItem: string[];
}

const FilesTree = ({
  className,
  tree,
  parent = [],
  activeItem,
  onSelectCategory,
  ...props
}: Props) => {
  return (
    <div className={className} {...props}>
      {Object.keys(tree).map((key) => {
        const item = tree[key];

        if (typeof item === 'object') {
          const firstChildKey = Object.keys(item)[0];
          if (typeof item[firstChildKey] === 'object') {
            return (
              <div key={key} className="relative">
                {!!parent?.length && (
                  <div className="w-2 h-[1px] bg-gray-400 absolute top-[12px] -left-2" />
                )}
                <div className="font-bold pl-1">{key}</div>
                <div className="pl-2 ml-2 relative">
                  <div className="w-[1px] h-[calc(100%-16px)] bg-gray-400 absolute left-0" />
                  <FilesTree
                    tree={item}
                    onSelectCategory={onSelectCategory}
                    parent={[...parent, key]}
                    activeItem={activeItem}
                  />
                </div>
              </div>
            );
          } else {
            const path = [...parent, key];
            const checked = arraysEqual(path, activeItem);
            return (
              <div key={key} className="relative">
                <div className="w-2 h-[1px] bg-gray-400 absolute top-[17px] -left-2" />
                <div
                  className={cn(
                    'whitespace-nowrap text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md text-sm leading-6 font-semibold',
                    {
                      'text-indigo-600 border border-indigo-300 bg-indigo-50': checked,
                      'border border-white': !checked,
                    },
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCategory(path)}
                    className="w-full text-left h-full p-1"
                  >
                    {key}
                  </button>
                </div>
              </div>
            );
          }
        }
        return <div key={key}>{key}</div>;
      })}
    </div>
  );
};

export default FilesTree;
