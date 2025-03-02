import { BadServerDataError } from "./error.ts";

import type {
  JsonValue,
  RpcFailure,
  RpcResponseBasis,
  RpcSuccess,
} from "../json_rpc_types.ts";

function validateRpcBasis(data: any): data is RpcResponseBasis {
  return (
    typeof data.id === "number" ||
    typeof data.id === "string" ||
    data.id === null
  );
}
function validateRpcSuccess(data: any): data is RpcSuccess {
  return "result" in data;
}
function validateRpcFailure(data: any): data is RpcFailure {
  return (
    typeof data?.error?.code === "number" &&
    typeof data.error.message === "string"
  );
}

export function validateResponse(data: unknown): RpcSuccess {
  if (validateRpcBasis(data)) {
    if (validateRpcSuccess(data)) return data;
    else if (validateRpcFailure(data)) {
      throw new BadServerDataError(
        data.id,
        data.error.message,
        data.error.code,
        data.error.data,
      );
    }
  }
  throw new BadServerDataError(
    null,
    "Received data is no RPC response object.",
    -32003,
  );
}
