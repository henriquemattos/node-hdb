// Copyright 2013 SAP AG.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an 
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific 
// language governing permissions and limitations under the License.
'use strict';

var client = require('./client');
var hdb = require('../index');

var sql =
  'select top 50 SCHEMA_NAME || \'.\' || TABLE_NAME as TABLE from TABLES';
client.exec(sql, false, function onexec(err, rs) {
  rs.createArrayStream()
    .once('error', function onerror(err) {
      done(err);
    })
    .once('end', function onend() {
      if (!rs.closed) {
        rs.close();
      }
      done(null);
    })
    .pipe(hdb.createJSONStringifier()).pipe(process.stdout);
});

function done(err) {
  client.end();
  if (err) {
    return console.error(err);
  }
}