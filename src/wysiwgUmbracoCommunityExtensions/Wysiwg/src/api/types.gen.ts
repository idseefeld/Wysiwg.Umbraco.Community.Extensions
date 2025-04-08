// This file is auto-generated by @hey-api/openapi-ts

export type Assembly = {
    readonly definedTypes: Array<(TypeInfo)>;
    readonly exportedTypes: Array<(Type)>;
    /**
     * @deprecated
     */
    readonly codeBase?: (string) | null;
    readonly entryPoint?: ((MethodInfo) | null);
    readonly fullName?: (string) | null;
    readonly imageRuntimeVersion: string;
    readonly isDynamic: boolean;
    readonly location: string;
    readonly reflectionOnly: boolean;
    readonly isCollectible: boolean;
    readonly isFullyTrusted: boolean;
    readonly customAttributes: Array<(CustomAttributeData)>;
    /**
     * @deprecated
     */
    readonly escapedCodeBase: string;
    readonly manifestModule: (Module);
    readonly modules: Array<(Module)>;
    /**
     * @deprecated
     */
    readonly globalAssemblyCache: boolean;
    readonly hostContext: number;
    securityRuleSet: SecurityRuleSet;
};

export type CallingConventions = 'Standard' | 'VarArgs' | 'Any' | 'HasThis' | 'ExplicitThis';

export type ConstructorInfo = {
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    attributes: MethodAttributes;
    methodImplementationFlags: MethodImplAttributes;
    callingConvention: CallingConventions;
    readonly isAbstract: boolean;
    readonly isConstructor: boolean;
    readonly isFinal: boolean;
    readonly isHideBySig: boolean;
    readonly isSpecialName: boolean;
    readonly isStatic: boolean;
    readonly isVirtual: boolean;
    readonly isAssembly: boolean;
    readonly isFamily: boolean;
    readonly isFamilyAndAssembly: boolean;
    readonly isFamilyOrAssembly: boolean;
    readonly isPrivate: boolean;
    readonly isPublic: boolean;
    readonly isConstructedGenericMethod: boolean;
    readonly isGenericMethod: boolean;
    readonly isGenericMethodDefinition: boolean;
    readonly containsGenericParameters: boolean;
    readonly methodHandle: (RuntimeMethodHandle);
    readonly isSecurityCritical: boolean;
    readonly isSecuritySafeCritical: boolean;
    readonly isSecurityTransparent: boolean;
    memberType: MemberTypes;
};

export type ContentTypeModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    name?: (string) | null;
    creatorId: number;
    parentId: number;
    level: number;
    path: string;
    sortOrder: number;
    trashed: boolean;
    alias: string;
    description?: (string) | null;
    icon?: (string) | null;
    thumbnail?: (string) | null;
    allowedAsRoot: boolean;
    listView?: (string) | null;
    isElement: boolean;
    allowedContentTypes?: Array<(ContentTypeSortModel)> | null;
    variations: ContentVariationModel;
    propertyGroups: Array<(PropertyGroupModel)>;
    readonly propertyTypes: Array<(PropertyTypeModel)>;
    noGroupPropertyTypes: Array<(PropertyTypeModel)>;
    readonly removedContentTypes: Array<(number)>;
    contentTypeComposition: Array<(ContentTypeModel | MediaTypeModel | MemberTypeModel)>;
    readonly compositionPropertyGroups: Array<(PropertyGroupModel)>;
    readonly compositionPropertyTypes: Array<(PropertyTypeModel)>;
    readonly supportsPublishing: boolean;
    readonly defaultTemplate?: ((TemplateModel | TemplateOnDiskModel) | null);
    defaultTemplateId: number;
    allowedTemplates?: Array<(TemplateModel | TemplateOnDiskModel)> | null;
    historyCleanup?: ((HistoryCleanupModel) | null);
};

export type ContentTypeSortModel = {
    sortOrder: number;
    alias: string;
    key: string;
};

export type ContentVariationModel = 'Nothing' | 'Culture' | 'Segment' | 'CultureAndSegment';

export type CustomAttributeData = {
    readonly attributeType: (Type);
    readonly constructor: (ConstructorInfo);
    readonly constructorArguments: Array<(CustomAttributeTypedArgument)>;
    readonly namedArguments: Array<(CustomAttributeNamedArgument)>;
};

export type CustomAttributeNamedArgument = {
    memberInfo: (MemberInfo);
    readonly typedValue: (CustomAttributeTypedArgument);
    readonly memberName: string;
    readonly isField: boolean;
};

export type CustomAttributeTypedArgument = {
    argumentType: (Type);
    value?: unknown;
};

export type EventAttributes = 'None' | 'SpecialName' | 'RTSpecialName' | 'ReservedMask';

export type EventInfo = {
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    memberType: MemberTypes;
    attributes: EventAttributes;
    readonly isSpecialName: boolean;
    readonly addMethod?: ((MethodInfo) | null);
    readonly removeMethod?: ((MethodInfo) | null);
    readonly raiseMethod?: ((MethodInfo) | null);
    readonly isMulticast: boolean;
    readonly eventHandlerType?: ((Type) | null);
};

export type FieldAttributes = 'PrivateScope' | 'Private' | 'FamANDAssem' | 'Assembly' | 'Family' | 'FamORAssem' | 'Public' | 'FieldAccessMask' | 'Static' | 'InitOnly' | 'Literal' | 'NotSerialized' | 'HasFieldRVA' | 'SpecialName' | 'RTSpecialName' | 'HasFieldMarshal' | 'PinvokeImpl' | 'HasDefault' | 'ReservedMask';

export type FieldInfo = {
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    memberType: MemberTypes;
    attributes: FieldAttributes;
    readonly fieldType: (Type);
    readonly isInitOnly: boolean;
    readonly isLiteral: boolean;
    /**
     * @deprecated
     */
    readonly isNotSerialized: boolean;
    readonly isPinvokeImpl: boolean;
    readonly isSpecialName: boolean;
    readonly isStatic: boolean;
    readonly isAssembly: boolean;
    readonly isFamily: boolean;
    readonly isFamilyAndAssembly: boolean;
    readonly isFamilyOrAssembly: boolean;
    readonly isPrivate: boolean;
    readonly isPublic: boolean;
    readonly isSecurityCritical: boolean;
    readonly isSecuritySafeCritical: boolean;
    readonly isSecurityTransparent: boolean;
    readonly fieldHandle: (RuntimeFieldHandle);
};

export type Func_2 = {
    readonly target?: unknown;
    readonly method: (MethodInfo);
};

export type GenericParameterAttributes = 'None' | 'Covariant' | 'Contravariant' | 'VarianceMask' | 'ReferenceTypeConstraint' | 'NotNullableValueTypeConstraint' | 'DefaultConstructorConstraint' | 'SpecialConstraintMask' | 'AllowByRefLike';

export type HistoryCleanupModel = {
    preventCleanup: boolean;
    keepAllVersionsNewerThanDays?: (number) | null;
    keepLatestVersionPerDayForDays?: (number) | null;
};

export type ICustomAttributeProvider = {
    [key: string]: unknown;
};

export type ImageCropperCropCoordinatesModel = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type ImageCropperCropModel = {
    alias?: (string) | null;
    width: number;
    height: number;
    coordinates?: ((ImageCropperCropCoordinatesModel) | null);
};

export type IntPtr = {
    [key: string]: unknown;
};

export type LayoutKind = 'Sequential' | 'Explicit' | 'Auto';

export type Lazy_1 = {
    readonly isValueCreated: boolean;
    readonly value: number;
};

export type MediaTypeModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    name?: (string) | null;
    creatorId: number;
    parentId: number;
    level: number;
    path: string;
    sortOrder: number;
    trashed: boolean;
    description?: (string) | null;
    icon?: (string) | null;
    thumbnail?: (string) | null;
    allowedAsRoot: boolean;
    listView?: (string) | null;
    isElement: boolean;
    allowedContentTypes?: Array<(ContentTypeSortModel)> | null;
    variations: ContentVariationModel;
    propertyGroups: Array<(PropertyGroupModel)>;
    readonly propertyTypes: Array<(PropertyTypeModel)>;
    noGroupPropertyTypes: Array<(PropertyTypeModel)>;
    readonly removedContentTypes: Array<(number)>;
    contentTypeComposition: Array<(ContentTypeModel | MediaTypeModel | MemberTypeModel)>;
    readonly compositionPropertyGroups: Array<(PropertyGroupModel)>;
    readonly compositionPropertyTypes: Array<(PropertyTypeModel)>;
    readonly supportsPublishing: boolean;
    alias: string;
};

export type MemberInfo = {
    memberType: MemberTypes;
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
};

export type MemberTypeModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    name?: (string) | null;
    creatorId: number;
    parentId: number;
    level: number;
    path: string;
    sortOrder: number;
    trashed: boolean;
    description?: (string) | null;
    icon?: (string) | null;
    thumbnail?: (string) | null;
    allowedAsRoot: boolean;
    listView?: (string) | null;
    isElement: boolean;
    allowedContentTypes?: Array<(ContentTypeSortModel)> | null;
    propertyGroups: Array<(PropertyGroupModel)>;
    readonly propertyTypes: Array<(PropertyTypeModel)>;
    noGroupPropertyTypes: Array<(PropertyTypeModel)>;
    readonly removedContentTypes: Array<(number)>;
    contentTypeComposition: Array<(ContentTypeModel | MediaTypeModel | MemberTypeModel)>;
    readonly compositionPropertyGroups: Array<(PropertyGroupModel)>;
    readonly compositionPropertyTypes: Array<(PropertyTypeModel)>;
    readonly supportsPublishing: boolean;
    variations: ContentVariationModel;
    alias: string;
};

export type MemberTypes = 'Constructor' | 'Event' | 'Field' | 'Method' | 'Property' | 'TypeInfo' | 'Custom' | 'NestedType' | 'All';

export type MethodAttributes = 'PrivateScope' | 'ReuseSlot' | 'Private' | 'FamANDAssem' | 'Assembly' | 'Family' | 'FamORAssem' | 'Public' | 'MemberAccessMask' | 'UnmanagedExport' | 'Static' | 'Final' | 'Virtual' | 'HideBySig' | 'NewSlot' | 'VtableLayoutMask' | 'CheckAccessOnOverride' | 'Abstract' | 'SpecialName' | 'RTSpecialName' | 'PinvokeImpl' | 'HasSecurity' | 'RequireSecObject' | 'ReservedMask';

export type MethodBase = {
    memberType: MemberTypes;
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    attributes: MethodAttributes;
    methodImplementationFlags: MethodImplAttributes;
    callingConvention: CallingConventions;
    readonly isAbstract: boolean;
    readonly isConstructor: boolean;
    readonly isFinal: boolean;
    readonly isHideBySig: boolean;
    readonly isSpecialName: boolean;
    readonly isStatic: boolean;
    readonly isVirtual: boolean;
    readonly isAssembly: boolean;
    readonly isFamily: boolean;
    readonly isFamilyAndAssembly: boolean;
    readonly isFamilyOrAssembly: boolean;
    readonly isPrivate: boolean;
    readonly isPublic: boolean;
    readonly isConstructedGenericMethod: boolean;
    readonly isGenericMethod: boolean;
    readonly isGenericMethodDefinition: boolean;
    readonly containsGenericParameters: boolean;
    readonly methodHandle: (RuntimeMethodHandle);
    readonly isSecurityCritical: boolean;
    readonly isSecuritySafeCritical: boolean;
    readonly isSecurityTransparent: boolean;
};

export type MethodImplAttributes = 'IL' | 'Managed' | 'Native' | 'OPTIL' | 'CodeTypeMask' | 'Runtime' | 'ManagedMask' | 'Unmanaged' | 'NoInlining' | 'ForwardRef' | 'Synchronized' | 'NoOptimization' | 'PreserveSig' | 'AggressiveInlining' | 'AggressiveOptimization' | 'InternalCall' | 'MaxMethodImplVal';

export type MethodInfo = {
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    attributes: MethodAttributes;
    methodImplementationFlags: MethodImplAttributes;
    callingConvention: CallingConventions;
    readonly isAbstract: boolean;
    readonly isConstructor: boolean;
    readonly isFinal: boolean;
    readonly isHideBySig: boolean;
    readonly isSpecialName: boolean;
    readonly isStatic: boolean;
    readonly isVirtual: boolean;
    readonly isAssembly: boolean;
    readonly isFamily: boolean;
    readonly isFamilyAndAssembly: boolean;
    readonly isFamilyOrAssembly: boolean;
    readonly isPrivate: boolean;
    readonly isPublic: boolean;
    readonly isConstructedGenericMethod: boolean;
    readonly isGenericMethod: boolean;
    readonly isGenericMethodDefinition: boolean;
    readonly containsGenericParameters: boolean;
    readonly methodHandle: (RuntimeMethodHandle);
    readonly isSecurityCritical: boolean;
    readonly isSecuritySafeCritical: boolean;
    readonly isSecurityTransparent: boolean;
    memberType: MemberTypes;
    readonly returnParameter: (ParameterInfo);
    readonly returnType: (Type);
    returnTypeCustomAttributes: ICustomAttributeProvider;
};

export type Module = {
    readonly assembly: (Assembly);
    readonly fullyQualifiedName: string;
    readonly name: string;
    readonly mdStreamVersion: number;
    readonly moduleVersionId: string;
    readonly scopeName: string;
    readonly moduleHandle: (ModuleHandle);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly metadataToken: number;
};

export type ModuleHandle = {
    readonly mdStreamVersion: number;
};

export type ParameterAttributes = 'None' | 'In' | 'Out' | 'Lcid' | 'Retval' | 'Optional' | 'HasDefault' | 'HasFieldMarshal' | 'Reserved3' | 'Reserved4' | 'ReservedMask';

export type ParameterInfo = {
    attributes: ParameterAttributes;
    readonly member: (MemberInfo);
    readonly name?: (string) | null;
    readonly parameterType: (Type);
    readonly position: number;
    readonly isIn: boolean;
    readonly isLcid: boolean;
    readonly isOptional: boolean;
    readonly isOut: boolean;
    readonly isRetval: boolean;
    readonly defaultValue?: unknown;
    readonly rawDefaultValue?: unknown;
    readonly hasDefaultValue: boolean;
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly metadataToken: number;
};

export type PropertyAttributes = 'None' | 'SpecialName' | 'RTSpecialName' | 'HasDefault' | 'Reserved2' | 'Reserved3' | 'Reserved4' | 'ReservedMask';

export type PropertyGroupModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    type: PropertyGroupTypeModel;
    name?: (string) | null;
    alias: string;
    sortOrder: number;
    propertyTypes?: Array<(PropertyTypeModel)> | null;
};

export type PropertyGroupTypeModel = 'Group' | 'Tab';

export type PropertyInfo = {
    readonly name: string;
    readonly declaringType?: ((Type) | null);
    readonly reflectedType?: ((Type) | null);
    readonly module: (Module);
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    memberType: MemberTypes;
    readonly propertyType: (Type);
    attributes: PropertyAttributes;
    readonly isSpecialName: boolean;
    readonly canRead: boolean;
    readonly canWrite: boolean;
    readonly getMethod?: ((MethodInfo) | null);
    readonly setMethod?: ((MethodInfo) | null);
};

export type PropertyTypeModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    supportsPublishing: boolean;
    name: string;
    alias: string;
    description?: (string) | null;
    dataTypeId: number;
    dataTypeKey: string;
    propertyEditorAlias: string;
    valueStorageType: ValueStorageTypeModel;
    propertyGroupId?: ((Lazy_1) | null);
    mandatory: boolean;
    mandatoryMessage?: (string) | null;
    labelOnTop: boolean;
    sortOrder: number;
    validationRegExp?: (string) | null;
    validationRegExpMessage?: (string) | null;
    variations: ContentVariationModel;
};

export type RuntimeFieldHandle = {
    readonly value: (IntPtr);
};

export type RuntimeMethodHandle = {
    readonly value: (IntPtr);
};

export type RuntimeTypeHandle = {
    readonly value: (IntPtr);
};

export type SecurityRuleSet = 'None' | 'Level1' | 'Level2';

export type StructLayoutAttribute = {
    readonly typeId: unknown;
    value: LayoutKind;
};

export type TemplateModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    getFileContent?: ((Func_2) | null);
    path: string;
    readonly originalPath: string;
    content?: (string) | null;
    virtualPath?: (string) | null;
    masterTemplateId?: ((Lazy_1) | null);
    masterTemplateAlias?: (string) | null;
    name?: (string) | null;
    alias: string;
    isMasterTemplate: boolean;
};

export type TemplateOnDiskModel = {
    id: number;
    key: string;
    createDate: string;
    updateDate: string;
    deleteDate?: (string) | null;
    readonly hasIdentity: boolean;
    getFileContent?: ((Func_2) | null);
    path: string;
    readonly originalPath: string;
    virtualPath?: (string) | null;
    masterTemplateId?: ((Lazy_1) | null);
    masterTemplateAlias?: (string) | null;
    name?: (string) | null;
    alias: string;
    isMasterTemplate: boolean;
    isOnDisk: boolean;
    content?: (string) | null;
};

export type Type = {
    readonly name: string;
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    memberType: MemberTypes;
    readonly namespace?: (string) | null;
    readonly assemblyQualifiedName?: (string) | null;
    readonly fullName?: (string) | null;
    readonly assembly: (Assembly);
    readonly module: (Module);
    readonly isInterface: boolean;
    readonly isNested: boolean;
    readonly declaringType?: ((Type) | null);
    readonly declaringMethod?: ((MethodBase) | null);
    readonly reflectedType?: ((Type) | null);
    readonly underlyingSystemType: (Type);
    readonly isTypeDefinition: boolean;
    readonly isArray: boolean;
    readonly isByRef: boolean;
    readonly isPointer: boolean;
    readonly isConstructedGenericType: boolean;
    readonly isGenericParameter: boolean;
    readonly isGenericTypeParameter: boolean;
    readonly isGenericMethodParameter: boolean;
    readonly isGenericType: boolean;
    readonly isGenericTypeDefinition: boolean;
    readonly isSZArray: boolean;
    readonly isVariableBoundArray: boolean;
    readonly isByRefLike: boolean;
    readonly isFunctionPointer: boolean;
    readonly isUnmanagedFunctionPointer: boolean;
    readonly hasElementType: boolean;
    readonly genericTypeArguments: Array<(Type)>;
    readonly genericParameterPosition: number;
    genericParameterAttributes: GenericParameterAttributes;
    attributes: TypeAttributes;
    readonly isAbstract: boolean;
    readonly isImport: boolean;
    readonly isSealed: boolean;
    readonly isSpecialName: boolean;
    readonly isClass: boolean;
    readonly isNestedAssembly: boolean;
    readonly isNestedFamANDAssem: boolean;
    readonly isNestedFamily: boolean;
    readonly isNestedFamORAssem: boolean;
    readonly isNestedPrivate: boolean;
    readonly isNestedPublic: boolean;
    readonly isNotPublic: boolean;
    readonly isPublic: boolean;
    readonly isAutoLayout: boolean;
    readonly isExplicitLayout: boolean;
    readonly isLayoutSequential: boolean;
    readonly isAnsiClass: boolean;
    readonly isAutoClass: boolean;
    readonly isUnicodeClass: boolean;
    readonly isCOMObject: boolean;
    readonly isContextful: boolean;
    readonly isEnum: boolean;
    readonly isMarshalByRef: boolean;
    readonly isPrimitive: boolean;
    readonly isValueType: boolean;
    readonly isSignatureType: boolean;
    readonly isSecurityCritical: boolean;
    readonly isSecuritySafeCritical: boolean;
    readonly isSecurityTransparent: boolean;
    readonly structLayoutAttribute?: ((StructLayoutAttribute) | null);
    readonly typeInitializer?: ((ConstructorInfo) | null);
    readonly typeHandle: (RuntimeTypeHandle);
    readonly guid: string;
    readonly baseType?: ((Type) | null);
    /**
     * @deprecated
     */
    readonly isSerializable: boolean;
    readonly containsGenericParameters: boolean;
    readonly isVisible: boolean;
};

export type TypeAttributes = 'NotPublic' | 'AutoLayout' | 'AnsiClass' | 'Class' | 'Public' | 'NestedPublic' | 'NestedPrivate' | 'NestedFamily' | 'NestedAssembly' | 'NestedFamANDAssem' | 'VisibilityMask' | 'NestedFamORAssem' | 'SequentialLayout' | 'ExplicitLayout' | 'LayoutMask' | 'Interface' | 'ClassSemanticsMask' | 'Abstract' | 'Sealed' | 'SpecialName' | 'RTSpecialName' | 'Import' | 'Serializable' | 'WindowsRuntime' | 'UnicodeClass' | 'AutoClass' | 'StringFormatMask' | 'CustomFormatClass' | 'HasSecurity' | 'ReservedMask' | 'BeforeFieldInit' | 'CustomFormatMask';

export type TypeInfo = {
    readonly name: string;
    readonly customAttributes: Array<(CustomAttributeData)>;
    readonly isCollectible: boolean;
    readonly metadataToken: number;
    memberType: MemberTypes;
    readonly namespace?: (string) | null;
    readonly assemblyQualifiedName?: (string) | null;
    readonly fullName?: (string) | null;
    readonly assembly: (Assembly);
    readonly module: (Module);
    readonly isInterface: boolean;
    readonly isNested: boolean;
    readonly declaringType?: ((Type) | null);
    readonly declaringMethod?: ((MethodBase) | null);
    readonly reflectedType?: ((Type) | null);
    readonly underlyingSystemType: (Type);
    readonly isTypeDefinition: boolean;
    readonly isArray: boolean;
    readonly isByRef: boolean;
    readonly isPointer: boolean;
    readonly isConstructedGenericType: boolean;
    readonly isGenericParameter: boolean;
    readonly isGenericTypeParameter: boolean;
    readonly isGenericMethodParameter: boolean;
    readonly isGenericType: boolean;
    readonly isGenericTypeDefinition: boolean;
    readonly isSZArray: boolean;
    readonly isVariableBoundArray: boolean;
    readonly isByRefLike: boolean;
    readonly isFunctionPointer: boolean;
    readonly isUnmanagedFunctionPointer: boolean;
    readonly hasElementType: boolean;
    readonly genericTypeArguments: Array<(Type)>;
    readonly genericParameterPosition: number;
    genericParameterAttributes: GenericParameterAttributes;
    attributes: TypeAttributes;
    readonly isAbstract: boolean;
    readonly isImport: boolean;
    readonly isSealed: boolean;
    readonly isSpecialName: boolean;
    readonly isClass: boolean;
    readonly isNestedAssembly: boolean;
    readonly isNestedFamANDAssem: boolean;
    readonly isNestedFamily: boolean;
    readonly isNestedFamORAssem: boolean;
    readonly isNestedPrivate: boolean;
    readonly isNestedPublic: boolean;
    readonly isNotPublic: boolean;
    readonly isPublic: boolean;
    readonly isAutoLayout: boolean;
    readonly isExplicitLayout: boolean;
    readonly isLayoutSequential: boolean;
    readonly isAnsiClass: boolean;
    readonly isAutoClass: boolean;
    readonly isUnicodeClass: boolean;
    readonly isCOMObject: boolean;
    readonly isContextful: boolean;
    readonly isEnum: boolean;
    readonly isMarshalByRef: boolean;
    readonly isPrimitive: boolean;
    readonly isValueType: boolean;
    readonly isSignatureType: boolean;
    readonly isSecurityCritical: boolean;
    readonly isSecuritySafeCritical: boolean;
    readonly isSecurityTransparent: boolean;
    readonly structLayoutAttribute?: ((StructLayoutAttribute) | null);
    readonly typeInitializer?: ((ConstructorInfo) | null);
    readonly typeHandle: (RuntimeTypeHandle);
    readonly guid: string;
    readonly baseType?: ((Type) | null);
    /**
     * @deprecated
     */
    readonly isSerializable: boolean;
    readonly containsGenericParameters: boolean;
    readonly isVisible: boolean;
    readonly genericTypeParameters: Array<(Type)>;
    readonly declaredConstructors: Array<(ConstructorInfo)>;
    readonly declaredEvents: Array<(EventInfo)>;
    readonly declaredFields: Array<(FieldInfo)>;
    readonly declaredMembers: Array<(MemberInfo)>;
    readonly declaredMethods: Array<(MethodInfo)>;
    readonly declaredNestedTypes: Array<(TypeInfo)>;
    readonly declaredProperties: Array<(PropertyInfo)>;
    readonly implementedInterfaces: Array<(Type)>;
};

export type ValueStorageTypeModel = 'Ntext' | 'Nvarchar' | 'Integer' | 'Date' | 'Decimal';

export type CropsData = {
    query?: {
        mediaItemId?: string;
    };
};

export type CropsResponse = (Array<(ImageCropperCropModel)>);

export type CropsError = (unknown | Array<(ImageCropperCropModel)>);

export type CropUrlData = {
    query?: {
        cropAlias?: string;
        mediaItemId?: string;
        selectedCrop?: string;
        selectedFocalPoint?: string;
        width?: number;
    };
};

export type CropUrlResponse = (string);

export type CropUrlError = (unknown | string);

export type ImageUrlData = {
    query?: {
        mediaItemId?: string;
    };
};

export type ImageUrlResponse = (string);

export type ImageUrlError = (unknown | string);

export type InstallResponse = (string);

export type InstallError = (unknown | string);

export type MediaTypesData = {
    query?: {
        name?: string;
    };
};

export type MediaTypesResponse = (Array<(MediaTypeModel)>);

export type MediaTypesError = (unknown | Array<(MediaTypeModel)>);

export type UnInstallResponse = (string);

export type UnInstallError = (unknown);