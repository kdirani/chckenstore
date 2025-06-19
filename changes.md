fix: resolve TypeScript production build errors

- Downgrade MUI from v7 to v5 for better compatibility
- Fix Framer Motion props: change translateY/translateX to y/x
- Fix ref type issues: handle null values in RefObject types
- Remove unused variables: theme, Paper, colors, previewUrl, ref
- Remove invalid TypeScript compiler option 'erasableSyntaxOnly'
- Fix Grid component usage compatibility with MUI v5
- Remove unused tableSx prop from GlobalReportTable

Build now passes successfully with no TypeScript errors.

