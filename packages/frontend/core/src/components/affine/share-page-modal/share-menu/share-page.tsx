import { notify, Skeleton } from '@affine/component';
import { PublicLinkDisableModal } from '@affine/component/disable-public-link';
import { Button } from '@affine/component/ui/button';
import { Menu, MenuItem, MenuTrigger } from '@affine/component/ui/menu';
import { openSettingModalAtom } from '@affine/core/atoms';
import { useSharingUrl } from '@affine/core/hooks/affine/use-share-url';
import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import { track } from '@affine/core/mixpanel';
import { ServerConfigService } from '@affine/core/modules/cloud';
import { WorkspacePermissionService } from '@affine/core/modules/permissions';
import { ShareService } from '@affine/core/modules/share-doc';
import { WorkspaceFlavour } from '@affine/env/workspace';
import { PublicPageMode } from '@affine/graphql';
import { useI18n } from '@affine/i18n';
import {
  CollaborationIcon,
  DoneIcon,
  EdgelessIcon,
  LinkIcon,
  LockIcon,
  PageIcon,
  SingleSelectSelectSolidIcon,
  ViewIcon,
} from '@blocksuite/icons/rc';
import {
  type DocMode,
  DocService,
  useLiveData,
  useService,
} from '@toeverything/infra';
import { cssVar } from '@toeverything/theme';
import { useSetAtom } from 'jotai';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CloudSvg } from '../cloud-svg';
import * as styles from './index.css';
import type { ShareMenuProps } from './share-menu';

export const LocalSharePage = (props: ShareMenuProps) => {
  const t = useI18n();

  return (
    <div className={styles.localSharePage}>
      <div className={styles.columnContainerStyle} style={{ gap: '12px' }}>
        <div className={styles.descriptionStyle} style={{ maxWidth: '230px' }}>
          {t['com.affine.share-menu.EnableCloudDescription']()}
        </div>
        <div>
          <Button
            onClick={props.onEnableAffineCloud}
            variant="primary"
            data-testid="share-menu-enable-affine-cloud-button"
          >
            {t['Enable AFFiNE Cloud']()}
          </Button>
        </div>
      </div>
      <div className={styles.cloudSvgContainer}>
        <CloudSvg />
      </div>
    </div>
  );
};

export const AFFiNESharePage = (props: ShareMenuProps) => {
  const t = useI18n();
  const {
    workspaceMetadata: { id: workspaceId },
  } = props;
  const doc = useService(DocService).doc;
  const shareService = useService(ShareService);
  const serverConfig = useService(ServerConfigService).serverConfig;
  useEffect(() => {
    shareService.share.revalidate();
  }, [shareService]);
  const isSharedPage = useLiveData(shareService.share.isShared$);
  const sharedMode = useLiveData(shareService.share.sharedMode$);
  const baseUrl = useLiveData(serverConfig.config$.map(c => c?.baseUrl));
  const isLoading =
    isSharedPage === null || sharedMode === null || baseUrl === null;
  const [showDisable, setShowDisable] = useState(false);
  const currentDocMode = useLiveData(doc.mode$);
  const mode = useMemo(() => {
    if (isSharedPage && sharedMode) {
      // if it's a shared page, use the share mode
      return sharedMode.toLowerCase() as DocMode;
    }
    // default to  page mode
    return currentDocMode;
  }, [currentDocMode, isSharedPage, sharedMode]);

  const permissionService = useService(WorkspacePermissionService);
  const isOwner = useLiveData(permissionService.permission.isOwner$);
  const setSettingModalAtom = useSetAtom(openSettingModalAtom);

  const { onClickCopyLink } = useSharingUrl({
    workspaceId,
    pageId: doc.id,
    urlType: 'share',
  });

  const onCopyPageLink = useCallback(() => {
    onClickCopyLink('page');
  }, [onClickCopyLink]);
  const onCopyEdgelessLink = useCallback(() => {
    onClickCopyLink('edgeless');
  }, [onClickCopyLink]);
  const onCopyBlockLink = useCallback(() => {
    onClickCopyLink(currentDocMode);
  }, [currentDocMode, onClickCopyLink]);

  const onOpenWorkspaceSettings = useCallback(() => {
    setSettingModalAtom({
      open: true,
      activeTab: 'workspace:preference',
      workspaceMetadata: props.workspaceMetadata,
    });
  }, [props.workspaceMetadata, setSettingModalAtom]);

  const onDisablePublic = useAsyncCallback(async () => {
    try {
      await shareService.share.disableShare();
      notify.error({
        title:
          t[
            'com.affine.share-menu.disable-publish-link.notification.success.title'
          ](),
        message:
          t[
            'com.affine.share-menu.disable-publish-link.notification.success.message'
          ](),
      });
    } catch (err) {
      notify.error({
        title:
          t[
            'com.affine.share-menu.disable-publish-link.notification.fail.title'
          ](),
        message:
          t[
            'com.affine.share-menu.disable-publish-link.notification.fail.message'
          ](),
      });
      console.log(err);
    }
    setShowDisable(false);
  }, [shareService, t]);

  const onClickDisable = useCallback(() => {
    if (isSharedPage) {
      setShowDisable(true);
    }
  }, [isSharedPage]);

  const onClickCreateLink = useAsyncCallback(async () => {
    if (isSharedPage) {
      return;
    }
    try {
      await shareService.share.enableShare(
        mode === 'edgeless' ? PublicPageMode.Edgeless : PublicPageMode.Page
      );
      track.$.sharePanel.$.createShareLink({
        mode,
      });
      notify.success({
        title:
          t[
            'com.affine.share-menu.create-public-link.notification.success.title'
          ](),
        message:
          t[
            'com.affine.share-menu.create-public-link.notification.success.message'
          ](),
        style: 'normal',
        icon: <SingleSelectSelectSolidIcon color={cssVar('primaryColor')} />,
      });
    } catch (err) {
      notify.error({
        title:
          t[
            'com.affine.share-menu.confirm-modify-mode.notification.fail.title'
          ](),
        message:
          t[
            'com.affine.share-menu.confirm-modify-mode.notification.fail.message'
          ](),
      });
      console.error(err);
    }
  }, [isSharedPage, mode, shareService.share, t]);

  const isMac = environment.isBrowser && environment.isMacOs;

  if (isLoading) {
    // TODO(@eyhn): loading and error UI
    return (
      <>
        <Skeleton height={100} />
        <Skeleton height={40} />
      </>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.titleContainerStyle}>
        {isSharedPage
          ? 'Anyon can access this link.'
          : 'Only workspace members can access this link.'}
      </div>
      <div className={styles.columnContainerStyle}>
        <div className={styles.rowContainerStyle}>
          <div className={styles.labelStyle}>Anyone with the link</div>
          <Menu
            contentOptions={{
              align: 'end',
            }}
            items={
              <>
                <MenuItem
                  preFix={
                    <LockIcon className={styles.publicMenuItemPrefixStyle} />
                  }
                  onSelect={onClickDisable}
                  className={styles.menuItemStyle}
                >
                  <div className={styles.publicItemRowStyle}>
                    <div>No Access</div>
                    {!isSharedPage && (
                      <DoneIcon className={styles.DoneIconStyle} />
                    )}
                  </div>
                </MenuItem>
                <MenuItem
                  preFix={
                    <ViewIcon className={styles.publicMenuItemPrefixStyle} />
                  }
                  className={styles.menuItemStyle}
                  onSelect={onClickCreateLink}
                >
                  <div className={styles.publicItemRowStyle}>
                    <div>Read Only</div>
                    {isSharedPage && (
                      <DoneIcon className={styles.DoneIconStyle} />
                    )}
                  </div>
                </MenuItem>
              </>
            }
          >
            <MenuTrigger className={styles.menuTriggerStyle}>
              {isSharedPage ? 'Read Only' : 'No Access'}
            </MenuTrigger>
          </Menu>
        </div>
        <div className={styles.rowContainerStyle}>
          <div className={styles.labelStyle}>Members in Workspace</div>
          <Button
            className={styles.menuTriggerStyle}
            style={{ cursor: 'not-allowed' }}
            disabled
          >
            {'Can Edit'}
          </Button>
        </div>
      </div>
      {isOwner && (
        <div
          className={styles.openWorkspaceSettingsStyle}
          onClick={onOpenWorkspaceSettings}
        >
          <CollaborationIcon fontSize={16} />
          Manage Workspace Members
        </div>
      )}
      <div style={{ padding: '4px' }}>
        <Menu
          contentOptions={{
            style: {
              minWidth: '260px',
            },
            align: 'end',
          }}
          items={
            <>
              <MenuItem
                preFix={
                  <PageIcon className={styles.publicMenuItemPrefixStyle} />
                }
                className={styles.menuItemStyle}
                onSelect={onCopyPageLink}
              >
                Copy Link to Page Mode
              </MenuItem>
              <MenuItem
                preFix={
                  <EdgelessIcon className={styles.publicMenuItemPrefixStyle} />
                }
                className={styles.menuItemStyle}
                onSelect={onCopyEdgelessLink}
              >
                Copy Link to Edgeless Mode
              </MenuItem>
              <MenuItem
                preFix={
                  <LinkIcon className={styles.publicMenuItemPrefixStyle} />
                }
                className={styles.menuItemStyle}
                onSelect={onCopyBlockLink}
              >
                Copy Link to Selected Block
              </MenuItem>
            </>
          }
        >
          <MenuTrigger className={styles.copyLinkTriggerStyle}>
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                lineHeight: '20px',
              }}
            >
              Copy Link
            </span>
            <span className={styles.copyLinkShortcutStyle}>
              {isMac ? '⌘ + ⌥ + C' : 'Ctrl + Shift + C'}
              <span className={styles.dividerStyle} />
            </span>
          </MenuTrigger>
        </Menu>
      </div>

      <PublicLinkDisableModal
        open={showDisable}
        onConfirm={onDisablePublic}
        onOpenChange={setShowDisable}
      />
    </div>
  );
};

export const SharePage = (props: ShareMenuProps) => {
  if (props.workspaceMetadata.flavour === WorkspaceFlavour.LOCAL) {
    return <LocalSharePage {...props} />;
  } else if (
    props.workspaceMetadata.flavour === WorkspaceFlavour.AFFINE_CLOUD
  ) {
    return (
      // TODO(@eyhn): refactor this part
      <ErrorBoundary fallback={null}>
        <Suspense>
          <AFFiNESharePage {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }
  throw new Error('Unreachable');
};
