import { extractPointerFromRef, extractSourceFromRef } from '@stoplight/json';
import React from 'react';
import { OpenAPIParser, RedocNormalizedOptions } from 'redoc';

import { ReferenceResolver } from '../utils/ref-resolving/ReferenceResolver';
import { useInlineRefResolver } from './InlineRefResolver';

class RedocParser extends OpenAPIParser {
  constructor(
    spec: any,
    specUrl?: string,
    options: RedocNormalizedOptions = new RedocNormalizedOptions({}),
    private refResolver?: ReferenceResolver | undefined,
  ) {
    super(spec, specUrl, options);
  }

  // Use Stoplight inline resolver
  byRef = <T extends any = any>(ref: string): T | undefined => {
    if (!this.spec) {
      return;
    }

    let $ref = ref;
    if (ref.charAt(0) !== '#') {
      $ref = '#' + ref;
    }

    if (this.refResolver) {
      const source = extractSourceFromRef($ref);
      const pointer = extractPointerFromRef($ref);
      return this.refResolver({ source, pointer }, null, {});
    }

    return super.byRef($ref);
  };
}

export interface RedocAppStore {
  options: RedocNormalizedOptions;
  parser?: OpenAPIParser;
}

const RedocAppStoreContext = React.createContext<RedocAppStore | undefined>(undefined);
RedocAppStoreContext.displayName = 'RedocAppStoreContext';

type RedocAppStoreProviderProps = {
  document?: any;
  options?: any;
};

export const RedocAppStoreProvider: React.FC<RedocAppStoreProviderProps> = ({ children, document, options }) => {
  const resolver = useInlineRefResolver();
  let appStore: RedocAppStore | undefined = undefined;
  if (document) {
    appStore = {
      options: new RedocNormalizedOptions(options),
      parser: new RedocParser(document, undefined, options, resolver),
    };
  }

  return <RedocAppStoreContext.Provider value={appStore}>{children}</RedocAppStoreContext.Provider>;
};

export const useRedocAppStore = () => React.useContext(RedocAppStoreContext);
