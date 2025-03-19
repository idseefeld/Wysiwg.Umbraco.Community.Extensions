// This file is auto-generated by @hey-api/openapi-ts

export const DocumentGranularPermissionModelSchema = {
    required: ['context', 'key', 'permission'],
    type: 'object',
    properties: {
        key: {
            type: 'string',
            format: 'uuid'
        },
        context: {
            type: 'string',
            readOnly: true
        },
        permission: {
            type: 'string'
        }
    },
    additionalProperties: false
} as const;

export const ReadOnlyUserGroupModelSchema = {
    required: ['alias', 'allowedLanguages', 'allowedSections', 'granularPermissions', 'hasAccessToAllLanguages', 'id', 'key', 'name', 'permissions'],
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            format: 'int32'
        },
        key: {
            type: 'string',
            format: 'uuid'
        },
        name: {
            type: 'string'
        },
        icon: {
            type: 'string',
            nullable: true
        },
        startContentId: {
            type: 'integer',
            format: 'int32',
            nullable: true
        },
        startMediaId: {
            type: 'integer',
            format: 'int32',
            nullable: true
        },
        alias: {
            type: 'string'
        },
        hasAccessToAllLanguages: {
            type: 'boolean'
        },
        allowedLanguages: {
            type: 'array',
            items: {
                type: 'integer',
                format: 'int32'
            }
        },
        permissions: {
            uniqueItems: true,
            type: 'array',
            items: {
                type: 'string'
            }
        },
        granularPermissions: {
            uniqueItems: true,
            type: 'array',
            items: {
                oneOf: [
                    {
                        '$ref': '#/components/schemas/DocumentGranularPermissionModel'
                    },
                    {
                        '$ref': '#/components/schemas/UnknownTypeGranularPermissionModel'
                    }
                ]
            }
        },
        allowedSections: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    },
    additionalProperties: false
} as const;

export const UnknownTypeGranularPermissionModelSchema = {
    required: ['context', 'permission'],
    type: 'object',
    properties: {
        context: {
            type: 'string'
        },
        permission: {
            type: 'string'
        }
    },
    additionalProperties: false
} as const;

export const UserGroupModelSchema = {
    required: ['alias', 'allowedLanguages', 'allowedSections', 'createDate', 'granularPermissions', 'hasAccessToAllLanguages', 'hasIdentity', 'id', 'key', 'permissions', 'updateDate', 'userCount'],
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            format: 'int32'
        },
        key: {
            type: 'string',
            format: 'uuid'
        },
        createDate: {
            type: 'string',
            format: 'date-time'
        },
        updateDate: {
            type: 'string',
            format: 'date-time'
        },
        deleteDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        hasIdentity: {
            type: 'boolean',
            readOnly: true
        },
        startMediaId: {
            type: 'integer',
            format: 'int32',
            nullable: true
        },
        startContentId: {
            type: 'integer',
            format: 'int32',
            nullable: true
        },
        icon: {
            type: 'string',
            nullable: true
        },
        alias: {
            type: 'string'
        },
        name: {
            type: 'string',
            nullable: true
        },
        hasAccessToAllLanguages: {
            type: 'boolean'
        },
        permissions: {
            uniqueItems: true,
            type: 'array',
            items: {
                type: 'string'
            }
        },
        granularPermissions: {
            uniqueItems: true,
            type: 'array',
            items: {
                oneOf: [
                    {
                        '$ref': '#/components/schemas/DocumentGranularPermissionModel'
                    },
                    {
                        '$ref': '#/components/schemas/UnknownTypeGranularPermissionModel'
                    }
                ]
            }
        },
        allowedSections: {
            type: 'array',
            items: {
                type: 'string'
            },
            readOnly: true
        },
        userCount: {
            type: 'integer',
            format: 'int32',
            readOnly: true
        },
        allowedLanguages: {
            type: 'array',
            items: {
                type: 'integer',
                format: 'int32'
            },
            readOnly: true
        }
    },
    additionalProperties: false
} as const;

export const UserKindModelSchema = {
    enum: ['Default', 'Api'],
    type: 'string'
} as const;

export const UserModelSchema = {
    required: ['allowedSections', 'createDate', 'email', 'failedPasswordAttempts', 'groups', 'hasIdentity', 'id', 'isApproved', 'isLockedOut', 'key', 'kind', 'profileData', 'sessionTimeout', 'updateDate', 'username', 'userState'],
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            format: 'int32'
        },
        key: {
            type: 'string',
            format: 'uuid'
        },
        createDate: {
            type: 'string',
            format: 'date-time'
        },
        updateDate: {
            type: 'string',
            format: 'date-time'
        },
        deleteDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        hasIdentity: {
            type: 'boolean',
            readOnly: true
        },
        emailConfirmedDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        invitedDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        username: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        rawPasswordValue: {
            type: 'string',
            nullable: true
        },
        passwordConfiguration: {
            type: 'string',
            nullable: true
        },
        isApproved: {
            type: 'boolean'
        },
        isLockedOut: {
            type: 'boolean'
        },
        lastLoginDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        lastPasswordChangeDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        lastLockoutDate: {
            type: 'string',
            format: 'date-time',
            nullable: true
        },
        failedPasswordAttempts: {
            type: 'integer',
            format: 'int32'
        },
        comments: {
            type: 'string',
            nullable: true
        },
        userState: {
            '$ref': '#/components/schemas/UserStateModel'
        },
        name: {
            type: 'string',
            nullable: true
        },
        allowedSections: {
            type: 'array',
            items: {
                type: 'string'
            },
            readOnly: true
        },
        profileData: {
            oneOf: [
                {
                    '$ref': '#/components/schemas/UserModel'
                },
                {
                    '$ref': '#/components/schemas/UserProfileModel'
                }
            ],
            readOnly: true
        },
        securityStamp: {
            type: 'string',
            nullable: true
        },
        avatar: {
            type: 'string',
            nullable: true
        },
        sessionTimeout: {
            type: 'integer',
            format: 'int32'
        },
        startContentIds: {
            type: 'array',
            items: {
                type: 'integer',
                format: 'int32'
            },
            nullable: true
        },
        startMediaIds: {
            type: 'array',
            items: {
                type: 'integer',
                format: 'int32'
            },
            nullable: true
        },
        language: {
            type: 'string',
            nullable: true
        },
        kind: {
            '$ref': '#/components/schemas/UserKindModel'
        },
        groups: {
            type: 'array',
            items: {
                oneOf: [
                    {
                        '$ref': '#/components/schemas/ReadOnlyUserGroupModel'
                    },
                    {
                        '$ref': '#/components/schemas/UserGroupModel'
                    }
                ]
            },
            readOnly: true
        }
    },
    additionalProperties: false
} as const;

export const UserProfileModelSchema = {
    required: ['id'],
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            format: 'int32'
        },
        name: {
            type: 'string',
            nullable: true
        }
    },
    additionalProperties: false
} as const;

export const UserStateModelSchema = {
    enum: ['Active', 'Disabled', 'LockedOut', 'Invited', 'Inactive', 'All'],
    type: 'string'
} as const;