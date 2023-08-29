import U from '/@/utils';
import { useUserInfo } from '/@/stores/modules/userInfo';

/**
 * @description 查看是否有权限点
 * @param points 需要查询的权限点
 */
export function searchPromissionPoint(points: string): boolean;
export function searchPromissionPoint(points: string[]): EmptyArrayType;
export function searchPromissionPoint(points: EmptyObjectType): EmptyObjectType;
export function searchPromissionPoint(points: any): any {
	const store = useUserInfo();
	const promissionPoint: string[] = store.userPermission.filter((x: any) => x.permissionType === 'POINT').map((x: any) => x.permissionCode);

	if (U.isString(points)) {
		return promissionPoint.includes(points);
	}

	if (U.isArray(points)) {
		return points.map((x: any) => promissionPoint.includes(x));
	}

	if (U.isObject(points)) {
		const result: EmptyObjectType = {};
		for (let key in points) {
			result[key] = promissionPoint.includes(points[key]);
		}

		return result;
	}
}
