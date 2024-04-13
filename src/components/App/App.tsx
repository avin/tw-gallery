import React, { useState } from 'react';
import directoryTree from 'virtual:directory-tree';
import FilesTree from '@/components/FilesTree/FilesTree.tsx';
import HtmlComponent from '@/components/HtmlComponent/HtmlComponent.tsx';

const App = () => {
  const [category, setCategory] = useState<Record<string, string> | null>(null);
  const [activeItem, activeActiveItem] = useState<string[]>([]);

  return (
    <div className="grid grid-cols-[auto,1fr]">
      <div className="border-r border-gray-400">
        <div className="p-4 overflow-y-auto max-h-[100vh]">
          <FilesTree
            tree={directoryTree}
            onSelectCategory={(category, activeItem) => {
              setCategory(category);
              activeActiveItem(activeItem);
            }}
            activeItem={activeItem}
          />
        </div>
      </div>

      <div>
        <div className="p-4 overflow-y-auto max-h-[100vh]">
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
