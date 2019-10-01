import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // 按需加载
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default {
  dateFormat(el) {
    let diffDays = dayjs().diff(el, "days");
    if (diffDays < 1) {
      return dayjs(el).fromNow();
    } else {
      return dayjs(el).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
