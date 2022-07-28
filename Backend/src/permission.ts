import database from "./database";

import { Permissions, Permission } from "../../Interfaces/Interfaces";

export const permissionRanks = {
	"*": 3,
	admin: 2,
	user: 1,
};

export const getInheritedPermissions = (permission: Permission) => {
	const canChange = {
		user: [] as Permission[],
		admin: [] as Permission[],
		"*": [] as Permission[],
	};
	canChange["admin"] = ["user"];
	canChange["*"] = [...canChange["admin"], "admin"];

	return canChange[permission];
};

export const findHighestRankLevel = (permissions: Permission[]) => {
	let highestRank = 0;
	for (const permission of permissions) {
		if (permissionRanks[permission] > highestRank) {
			highestRank = permissionRanks[permission];
		}
	}
	return highestRank;
};

export const findHighestRankName = (permissions: Permission[]) => {
	let highestRank = 0;
	let highestRankName: Permission = "user";
	for (const permission of permissions) {
		if (permissionRanks[permission] > highestRank) {
			highestRank = permissionRanks[permission];
			highestRankName = permission;
		}
	}
	return highestRankName;
};

export const canAssignPermissionAs = (permission: Permission, rank: Permission) => {
	if (!getInheritedPermissions(rank).includes(permission)) {
		return false;
	}
	return true;
};

export const canAltarPermission = async (serial: string, uuidSelf: string, uuidOther: string) => {
	const [permissionRecord] = (await database.read("permissions", { serial })) as unknown as Permissions[];
	if (!permissionRecord) {
		return false;
	}
	const { users } = permissionRecord;
	const userSelf = users.find((user) => user.uuid === uuidSelf);
	if (!userSelf) {
		return false;
	}
	const userOther = users.find((user) => user.uuid === uuidOther);
	if (!userOther) {
		return false;
	}

	const highestRankSelf = findHighestRankLevel(userSelf.permissions);
	const highestRankOther = findHighestRankLevel(userOther.permissions);
	return highestRankSelf > highestRankOther;
};

export const grantPermission = async (serial: string, uuidSelf: string, uuidOther: string, permission: Permission) => {
	const [permissionRecord] = (await database.read("permissions", { serial })) as unknown as Permissions[];
	if (!permissionRecord) {
		return false;
	}

	const canAlter = await canAltarPermission(serial, uuidSelf, uuidOther);
	if (!canAlter) {
		return false;
	}

	const { users } = permissionRecord;
	const userSelf = users.find((user) => user.uuid === uuidSelf);
	if (!userSelf) {
		//Impossible
		return false;
	}

	const userOther = users.find((user) => user.uuid === uuidOther);
	if (!userOther) {
		//Impossible
		return false;
	}

	if (userOther.permissions.includes(permission)) {
		return false;
	}

	const rankSelf = findHighestRankName(userSelf.permissions);
	if (!canAssignPermissionAs(permission, rankSelf)) {
		return false;
	}

	userOther.permissions.push(permission);
	await database.update("permissions", { serial }, permissionRecord);
	return true;
};

export const revokePermission = async (serial: string, uuidSelf: string, uuidOther: string, permission: Permission) => {
	const [permissionRecord] = (await database.read("permissions", { serial })) as unknown as Permissions[];
	if (!permissionRecord) {
		return false;
	}

	const canAlter = await canAltarPermission(serial, uuidSelf, uuidOther);
	if (!canAlter) {
		return false;
	}

	const { users } = permissionRecord;
	const userSelf = users.find((user) => user.uuid === uuidSelf);
	if (!userSelf) {
		//Impossible
		return false;
	}

	const userOther = users.find((user) => user.uuid === uuidOther);
	if (!userOther) {
		//Impossible
		return false;
	}

	if (!userOther.permissions.includes(permission)) {
		return false;
	}

	const rankSelf = findHighestRankName(userSelf.permissions);
	if (!canAssignPermissionAs(permission, rankSelf)) {
		return false;
	}

	userOther.permissions = userOther.permissions.filter((p) => p !== permission);
	await database.update("permissions", { serial }, permissionRecord);
	return true;
};

export const addUserToPermissions = async (serial: string, uuidSelf: string, uuidOther: string) => {
	const [permissionRecord] = (await database.read("permissions", { serial })) as unknown as Permissions[];
	if (!permissionRecord) {
		return false;
	}

	const { users } = permissionRecord;
	const userSelf = users.find((user) => user.uuid === uuidSelf);
	if (!userSelf) {
		//Impossible
		return false;
	}

	const userOther = users.find((user) => user.uuid === uuidOther);
	if (userOther) {
		return false;
	}

	const rank = findHighestRankName(userSelf.permissions);
	if (!canAssignPermissionAs("user", rank)) {
		return false;
	}

	users.push({
		uuid: uuidOther,
		permissions: ["user"],
	});

	await database.update("permissions", { serial }, permissionRecord);
	return true;
};

export const removeUserFromPermissions = async (serial: string, uuidSelf: string, uuidOther: string) => {
	const [permissionRecord] = (await database.read("permissions", { serial })) as unknown as Permissions[];
	if (!permissionRecord) {
		return false;
	}

	const { users } = permissionRecord;
	const userSelf = users.find((user) => user.uuid === uuidSelf);
	if (!userSelf) {
		//Impossible
		return false;
	}

	const userOther = users.find((user) => user.uuid === uuidOther);
	if (!userOther) {
		//Impossible
		return false;
	}

	const canAlter = await canAltarPermission(serial, uuidSelf, uuidOther);
	if (!canAlter) {
		return false;
	}

	//completely remove the user from the list
	users.splice(users.indexOf(userOther), 1);
	await database.update("permissions", { serial }, permissionRecord);
	return true;
};

export const getPermissions = async (serial: string) => {
	const [permissionRecord] = (await database.read("permissions", { serial })) as unknown as Permissions[];
	if (!permissionRecord) {
		return [];
	}
	return permissionRecord.users;
};

export const getPermissionsFor = async (serial: string, uuid: string, showInherited: boolean = false) => {
	const users = await getPermissions(serial);

	const user = users.find((user) => user.uuid === uuid);
	if (!user) {
		return [];
	}

	if (showInherited) {
		for (const permission of user.permissions) {
			const inheritedPermissions = getInheritedPermissions(permission);
			for (const inheritedPermission of inheritedPermissions) {
				if (!user.permissions.includes(inheritedPermission)) {
					user.permissions.push(inheritedPermission);
				}
			}
		}
	}

	return user.permissions;
};
