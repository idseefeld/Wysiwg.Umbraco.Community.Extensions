// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-fetch';
import type { CropUrlData, CropUrlError, CropUrlResponse, ImageUrlData, ImageUrlError, ImageUrlResponse, InstallError, InstallResponse, UnInstallError, UnInstallResponse } from './types.gen';

export const client = createClient(createConfig());

export class WysiwgUmbracoCommunityExtensionsService {
    public static cropUrl<ThrowOnError extends boolean = false>(options?: Options<CropUrlData, ThrowOnError>) {
        return (options?.client ?? client).get<CropUrlResponse, CropUrlError, ThrowOnError>({
            ...options,
            url: '/umbraco/wysiwgumbracocommunityextensions/api/v1/cropurl'
        });
    }
    
    public static imageUrl<ThrowOnError extends boolean = false>(options?: Options<ImageUrlData, ThrowOnError>) {
        return (options?.client ?? client).get<ImageUrlResponse, ImageUrlError, ThrowOnError>({
            ...options,
            url: '/umbraco/wysiwgumbracocommunityextensions/api/v1/imageurl'
        });
    }
    
    public static install<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<InstallResponse, InstallError, ThrowOnError>({
            ...options,
            url: '/umbraco/wysiwgumbracocommunityextensions/api/v1/install'
        });
    }
    
    public static unInstall<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<UnInstallResponse, UnInstallError, ThrowOnError>({
            ...options,
            url: '/umbraco/wysiwgumbracocommunityextensions/api/v1/uninstall'
        });
    }
    
}