/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js')
const proto = require('./main_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.MainProtoClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.MainProtoPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Empty,
 *   !proto.ServerReplyList>}
 */
const methodDescriptor_MainProto_GetRecords = new grpc.web.MethodDescriptor(
  '/MainProto/GetRecords',
  grpc.web.MethodType.UNARY,
  proto.Empty,
  proto.ServerReplyList,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ServerReplyList.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.Empty,
 *   !proto.ServerReplyList>}
 */
const methodInfo_MainProto_GetRecords = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ServerReplyList,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ServerReplyList.deserializeBinary
);


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ServerReplyList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ServerReplyList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.MainProtoClient.prototype.getRecords =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/MainProto/GetRecords',
      request,
      metadata || {},
      methodDescriptor_MainProto_GetRecords,
      callback);
};


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ServerReplyList>}
 *     A native promise that resolves to the response
 */
proto.MainProtoPromiseClient.prototype.getRecords =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/MainProto/GetRecords',
      request,
      metadata || {},
      methodDescriptor_MainProto_GetRecords);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Empty,
 *   !proto.ServerReply>}
 */
const methodDescriptor_MainProto_AddRecord = new grpc.web.MethodDescriptor(
  '/MainProto/AddRecord',
  grpc.web.MethodType.UNARY,
  proto.Empty,
  proto.ServerReply,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ServerReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.Empty,
 *   !proto.ServerReply>}
 */
const methodInfo_MainProto_AddRecord = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ServerReply,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ServerReply.deserializeBinary
);


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ServerReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ServerReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.MainProtoClient.prototype.addRecord =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/MainProto/AddRecord',
      request,
      metadata || {},
      methodDescriptor_MainProto_AddRecord,
      callback);
};


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ServerReply>}
 *     A native promise that resolves to the response
 */
proto.MainProtoPromiseClient.prototype.addRecord =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/MainProto/AddRecord',
      request,
      metadata || {},
      methodDescriptor_MainProto_AddRecord);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.ClientRequest,
 *   !proto.Empty>}
 */
const methodDescriptor_MainProto_RemoveRecord = new grpc.web.MethodDescriptor(
  '/MainProto/RemoveRecord',
  grpc.web.MethodType.UNARY,
  proto.ClientRequest,
  proto.Empty,
  /**
   * @param {!proto.ClientRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ClientRequest,
 *   !proto.Empty>}
 */
const methodInfo_MainProto_RemoveRecord = new grpc.web.AbstractClientBase.MethodInfo(
  proto.Empty,
  /**
   * @param {!proto.ClientRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Empty.deserializeBinary
);


/**
 * @param {!proto.ClientRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.MainProtoClient.prototype.removeRecord =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/MainProto/RemoveRecord',
      request,
      metadata || {},
      methodDescriptor_MainProto_RemoveRecord,
      callback);
};


/**
 * @param {!proto.ClientRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Empty>}
 *     A native promise that resolves to the response
 */
proto.MainProtoPromiseClient.prototype.removeRecord =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/MainProto/RemoveRecord',
      request,
      metadata || {},
      methodDescriptor_MainProto_RemoveRecord);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.ClientRequest,
 *   !proto.Empty>}
 */
const methodDescriptor_MainProto_UpdateRecord = new grpc.web.MethodDescriptor(
  '/MainProto/UpdateRecord',
  grpc.web.MethodType.UNARY,
  proto.ClientRequest,
  proto.Empty,
  /**
   * @param {!proto.ClientRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ClientRequest,
 *   !proto.Empty>}
 */
const methodInfo_MainProto_UpdateRecord = new grpc.web.AbstractClientBase.MethodInfo(
  proto.Empty,
  /**
   * @param {!proto.ClientRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Empty.deserializeBinary
);


/**
 * @param {!proto.ClientRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.MainProtoClient.prototype.updateRecord =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/MainProto/UpdateRecord',
      request,
      metadata || {},
      methodDescriptor_MainProto_UpdateRecord,
      callback);
};


/**
 * @param {!proto.ClientRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Empty>}
 *     A native promise that resolves to the response
 */
proto.MainProtoPromiseClient.prototype.updateRecord =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/MainProto/UpdateRecord',
      request,
      metadata || {},
      methodDescriptor_MainProto_UpdateRecord);
};


module.exports = proto;

