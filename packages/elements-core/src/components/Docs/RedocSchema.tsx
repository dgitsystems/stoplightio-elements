import { withErrorBoundary } from '@stoplight/react-error-boundary';
import React from 'react';
import { OptionsProvider, Schema, SchemaModel, SchemaOptions, ThemeProvider } from 'redoc';

import { RedocAppStore } from '../../context/RedocAppStore';

type RedocSchemaOptions = {
  data?: any;
  appStore: RedocAppStore;
} & SchemaOptions;

const RedocSchemaComponent: React.FC<RedocSchemaOptions> = ({
  showTitle,
  skipReadOnly,
  skipWriteOnly,
  level,
  data,
  appStore,
}) => {
  let redocSchema;
  if (appStore && appStore.parser) {
    redocSchema = new SchemaModel(appStore.parser, data, '', appStore.options);
  }

  if (!appStore) {
    return null;
  }

  return (
    <ThemeProvider theme={appStore.options.theme}>
      <OptionsProvider value={appStore.options}>
        <div className="redoc-schema">
          <Schema
            schema={redocSchema}
            showTitle={showTitle}
            skipReadOnly={skipReadOnly}
            skipWriteOnly={skipWriteOnly}
            level={level}
          ></Schema>
        </div>
      </OptionsProvider>
    </ThemeProvider>
  );
};

export const RedocSchema = withErrorBoundary<RedocSchemaOptions>(RedocSchemaComponent, {
  recoverableProps: ['data', 'appStore'],
});
