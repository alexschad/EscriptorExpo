import uuid from 'react-native-uuid';
import { ConnectionListType, ConnectionActionType } from '@/shared/Types';
import storage from '@/shared/Storage';

export enum ACTIONS {
  INIT_DATA = 'init_data',
  ADD_CONNECTION = 'add_connection',
  EDIT_CONNECTION = 'edit_connection',
  EDIT_CONNECTION_AUTHOR = 'edit_connection_author',
  SET_ACCESS_TOKEN = 'set_access_token',
  DELETE_CONNECTION = 'delete_connection',
}

const reducer = (
  connections: ConnectionListType,
  action: ConnectionActionType,
): ConnectionListType => {
  switch (action.type) {
    // initialize
    case ACTIONS.INIT_DATA:
      return action.payload.connections || [];
    // add new connection
    case ACTIONS.ADD_CONNECTION: {
      return [
        {
          id: uuid.v4() as string,
          title: action.payload.title || '',
          description: action.payload.description || '',
          authorFName: action.payload.authorFName || '',
          authorLName: action.payload.authorLName || '',
          authorTagId: action.payload.authorTagId || '',
          instanceId: action.payload.instanceId,
          key: action.payload.key || '',
          secret: action.payload.secret || '',
          access_token: '',
          created: Date.now(),
        },
        ...connections,
      ];
    }
    // edit connection metadata
    case ACTIONS.EDIT_CONNECTION: {
      return connections.map(l => {
        if (l.id === action.payload.connectionId) {
          return {
            id: l.id,
            title: action.payload.title || '',
            description: action.payload.description || '',
            instanceId: action.payload.instanceId,
            key: action.payload.key || '',
            secret: action.payload.secret || '',
            authorFName: l.authorFName,
            authorLName: l.authorLName,
            authorTagId: l.authorTagId,
            access_token: l.access_token,
            created: l.created,
          };
        }
        return l;
      });
    }
    // edit connection metadata
    case ACTIONS.EDIT_CONNECTION_AUTHOR: {
      return connections.map(l => {
        if (l.id === action.payload.connectionId) {
          return {
            id: l.id,
            title: l.title,
            description: l.description,
            instanceId: l.instanceId,
            key: l.key,
            secret: l.secret,
            authorFName: action.payload.authorFName || '',
            authorLName: action.payload.authorLName || '',
            authorTagId: action.payload.authorTagId || '',
            access_token: l.access_token,
            created: l.created,
          };
        }
        return l;
      });
    }
    // set access token
    case ACTIONS.SET_ACCESS_TOKEN: {
      return connections.map(l => {
        if (l.id === action.payload.connectionId) {
          return {
            id: l.id,
            title: l.title,
            description: l.description,
            authorFName: l.authorFName,
            authorLName: l.authorLName,
            authorTagId: l.authorTagId,
            instanceId: l.instanceId,
            key: l.key,
            secret: l.secret,
            access_token: action.payload.access_token || '',
            created: l.created,
          };
        }
        return l;
      });
    }
    // delete connection
    case ACTIONS.DELETE_CONNECTION: {
      return connections.filter(l => l.id !== action.payload.connectionId);
    }
    default:
      return connections;
  }
};

export const withMMKVStorageCache = (r: any) => {
  return (connections: ConnectionListType, action: ConnectionActionType) => {
    const newState = r(connections, action);
    storage.set('escriptorConnections', JSON.stringify(newState));
    return newState;
  };
};

export default reducer;
