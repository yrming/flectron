import { dialog, shell } from "electron";
import axios from "axios";
import pkg from "../../package.json";
const version = pkg.version;
const release = "https://api.github.com/repos/yrming/flectron/releases/latest";
const downloadUrl = "https://github.com/yrming/flectron/releases/latest";

const checkVersion = async () => {
  const res = await axios.get(release);
  if (res.status === 200) {
    const latest = res.data.name;
    const result = compareVersion(version, latest);
    if (result) {
      dialog.showMessageBox(
        {
          type: "info",
          title: "发现新版本",
          buttons: ["好的", "下次再说"],
          message: `发现新版本${latest}，是否去下载最新的版本？`
        },
        res => {
          if (res === 0) {
            shell.openExternal(downloadUrl);
          }
        }
      );
    }
  } else {
    return false;
  }
};

const compareVersion = (current, latest) => {
  const currentVersion = current.split(".").map(item => parseInt(item));
  const latestVersion = latest.split(".").map(item => parseInt(item));

  for (let i = 0; i < 3; i++) {
    if (currentVersion[i] < latestVersion[i]) {
      return true;
    }
    if (currentVersion[i] > latestVersion[i]) {
      return false;
    }
  }
  return false;
};

export default checkVersion;
