import {format} from 'date-fns';

// Hàm để chuyển đổi timestamp thành dạng ngày tháng
export const formatTimestampToDate = timestamp => {
  return format(new Date(timestamp), "MMMM d',' yyyy");
};
