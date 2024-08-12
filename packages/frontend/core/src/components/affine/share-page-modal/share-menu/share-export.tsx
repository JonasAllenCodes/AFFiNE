import { ExportMenuItems } from '@affine/core/components/page-list';
import { useExportPage } from '@affine/core/hooks/affine/use-export-page';
import { DocService, useLiveData, useService } from '@toeverything/infra';

import * as styles from './index.css';
import type { ShareMenuProps } from './share-menu';

export const ShareExport = ({ currentPage }: ShareMenuProps) => {
  const doc = useService(DocService).doc;

  const exportHandler = useExportPage(currentPage);
  const currentMode = useLiveData(doc.mode$);

  return (
    <>
      <div className={styles.descriptionStyle}>
        Download a static copy of your page to share with others.
      </div>
      <div>
        <ExportMenuItems
          exportHandler={exportHandler}
          className={styles.exportItemStyle}
          pageMode={currentMode}
        />
      </div>
    </>
  );
};
