
import Cookies from "js-cookie";
let ProjectData = {};

/**
 * 获取当前选择的线路名称
 */
ProjectData.getLineName = () => {
    return Cookies.get("line") == 0
        ? "北京首都机场线"
        : `北京${Cookies.get("line")}号线`;
};

/**
 * 获取当前线路的Number值
 */
ProjectData.getLineValue = () => {
    return Cookies.get("line");
}

export default ProjectData;