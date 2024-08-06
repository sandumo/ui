import { Pagination as MuiPagination, PaginationItem, PaginationProps as MuiPaginationProps } from '@mui/material';

type PaginationProps = Omit<MuiPaginationProps, 'onChange'> & {
  page: number;
  onChange?: (page: number) => void;
  count: number;
}

export default function Pagination({
  page,
  onChange,
  count,
  sx,
  ...props
}: PaginationProps) {
  return (
    <MuiPagination
      count={count}
      page={page + 1}
      shape="rounded"
      size="large"
      sx={{
        '& .MuiPagination-ul': {
          '& > *:last-child': {
            '& .MuiButtonBase-root': {
              mr: 0,
            },
          },
        },
        ...sx,
      }}
      renderItem={(item) => (
        <PaginationItem
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': {
                bgcolor: 'primary.main',
              },
            },

          }}
          {...item}
        />
      )}
      onChange={(e, pageIndex) => onChange?.(pageIndex - 1)}
      {...props}
    />
  );
}
