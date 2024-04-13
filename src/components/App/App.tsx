import React, { useEffect, useMemo, useState } from 'react';
import { get } from 'lodash-es';
import directoryTree from 'virtual:directory-tree';
import FilesTree from '@/components/FilesTree/FilesTree.tsx';
import HtmlComponent from '@/components/HtmlComponent/HtmlComponent.tsx';

const App = () => {
  const [activeItem, activeActiveItem] = useState<string[]>(
    window.location.hash.replace(/^#/, '').split('/'),
  );

  const category = useMemo(() => {
    const f = get(directoryTree, activeItem);
    return f;
  }, [activeItem]);

  const originalSiteLink = useMemo(() => {
    if (!activeItem.length) {
      return null;
    }
    return `https://tailwindui.com/components/${activeItem.join('/')}`;
  }, [activeItem]);

  useEffect(() => {
    window.location.hash = activeItem.join('/');
  }, [activeItem]);

  return (
    <div className="grid grid-cols-[auto,1fr]">
      <div className="border-r border-gray-400">
        <div className="p-4 overflow-y-auto max-h-[100vh]">
          <FilesTree
            tree={directoryTree}
            onSelectCategory={(activeItem) => {
              activeActiveItem(activeItem);
            }}
            activeItem={activeItem}
          />
        </div>
      </div>

      <div>
        <div className="p-4 overflow-y-auto max-h-[100vh]">
          {originalSiteLink && (
            <div className="mb-4">
              <a
                href={originalSiteLink}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Original gallery
              </a>
            </div>
          )}

          {category &&
            Object.keys(category).map((key) => {
              return (
                <div key={key}>
                  <HtmlComponent name={key} path={category[key]} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default App;
