import { cssVar } from '@toeverything/theme';
import { globalStyle, style } from '@vanilla-extract/css';
export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: cssVar('fontSm'),
  fontWeight: 600,
  lineHeight: '22px',
  padding: '0 4px',
  gap: '4px',
});
export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});
export const menuStyle = style({
  width: '390px',
  height: 'auto',
  padding: '12px',
});
export const menuTriggerStyle = style({
  width: '150px',
  padding: '4px 10px',
  justifyContent: 'space-between',
});
export const menuItemStyle = style({
  padding: '4px',
});
export const publicItemRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
export const publicMenuItemPrefixStyle = style({
  fontSize: cssVar('fontH5'),
  color: cssVar('iconColor'),
  marginRight: '8px',
});
export const DoneIconStyle = style({
  color: cssVar('primaryColor'),
  fontSize: cssVar('fontH5'),
  marginLeft: '8px',
});
export const exportItemStyle = style({
  padding: '4px',
  transition: 'all 0.3s',
});
export const copyLinkTriggerStyle = style({
  width: '100%',
  padding: '4px 12px',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
  backgroundColor: cssVar('primaryColor'),
  color: cssVar('pureWhite'),
  ':hover': {
    backgroundColor: cssVar('primaryColor'),
    color: cssVar('pureWhite'),
  },
});
globalStyle(`${copyLinkTriggerStyle} svg`, {
  color: cssVar('pureWhite'),
  transform: 'translateX(2px)',
});
export const copyLinkShortcutStyle = style({
  position: 'absolute',
  right: '36px',
  paddingRight: '8px',
  opacity: 0.5,
  lineHeight: '20px',
});
export const copyLinkMenuItemStyle = style({
  padding: '4px',
  transition: 'all 0.3s',
});
export const dividerStyle = style({
  width: '1px',
  height: '100%',
  backgroundColor: cssVar('black10'),
  position: 'absolute',
  right: '0',
});
export const descriptionStyle = style({
  wordWrap: 'break-word',
  fontSize: cssVar('fontXs'),
  lineHeight: '20px',
  color: cssVar('textSecondaryColor'),
  textAlign: 'left',
  padding: '0 6px',
});
export const containerStyle = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: '8px',
});
export const indicatorContainerStyle = style({
  position: 'relative',
});
export const titleContainerStyle = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: cssVar('fontXs'),
  color: cssVar('textSecondaryColor'),
  fontWeight: 400,
  padding: '8px 4px 0 4px',
});
export const columnContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  gap: '8px',
});
export const rowContainerStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px',
});
export const labelStyle = style({
  fontSize: cssVar('fontSm'),
  fontWeight: 500,
});
export const disableSharePage = style({
  color: cssVar('errorColor'),
});
export const localSharePage = style({
  padding: '12px 8px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px',
  backgroundColor: cssVar('backgroundSecondaryColor'),
  minHeight: '84px',
  position: 'relative',
});
export const cloudSvgContainer = style({
  width: '146px',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  position: 'absolute',
  bottom: '0',
  right: '0',
});
export const shareLinkStyle = style({
  padding: '4px',
  fontSize: cssVar('fontXs'),
  fontWeight: 500,
  lineHeight: '20px',
  transform: 'translateX(-4px)',
  gap: '4px',
});
globalStyle(`${shareLinkStyle} > span`, {
  color: cssVar('linkColor'),
});
globalStyle(`${shareLinkStyle} > div > svg`, {
  color: cssVar('linkColor'),
});
export const buttonContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 500,
});
export const button = style({
  padding: '6px 8px',
  height: 32,
});
export const shortcutStyle = style({
  fontSize: cssVar('fontXs'),
  color: cssVar('textSecondaryColor'),
  fontWeight: 400,
});
export const openWorkspaceSettingsStyle = style({
  color: cssVar('linkColor'),
  fontSize: cssVar('fontXs'),
  fontWeight: 500,
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  padding: '4px',
  cursor: 'pointer',
});
globalStyle(`${openWorkspaceSettingsStyle} svg`, {
  color: cssVar('linkColor'),
});
