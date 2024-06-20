import {format} from 'date-fns';

export const formatTimestampToDate = timestamp => {
  return format(new Date(timestamp), "MMMM d',' yyyy");
};
