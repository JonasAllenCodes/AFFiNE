// src/components/index.css.ts
import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';

export const tabsRoot = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '8px',
});

export const tabsList = style({
  display: 'flex',
  gap: '12px',
  boxSizing: 'border-box',
  position: 'relative',
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    height: '1px',
    backgroundColor: cssVar('borderColor'),
  },
});

export const tabsTrigger = style({
  all: 'unset',
  fontWeight: 500,
  padding: '6px 4px',
  cursor: 'pointer',
  fontSize: cssVar('fontSm'),
  color: cssVar('textSecondaryColor'),
  borderBottom: '2px solid transparent',
  selectors: {
    '&[data-state="active"]': {
      color: cssVar('textPrimaryColor'),
      borderColor: cssVar('primaryColor'),
    },
  },
});

export const tabsContent = style({
  display: 'flex',
  flexDirection: 'column',

  selectors: {
    '&[data-state="inactive"]': {
      display: 'none',
    },
  },
});
