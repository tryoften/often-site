# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#! /bin/bash

set -x

ZONE=us-central1-f
gcloud config set compute/zone $ZONE

GROUP=website-group
TEMPLATE=$GROUP-tmpl
SERVICE=website-service

gcloud compute instance-groups managed stop-autoscaling $GROUP --zone $ZONE

gcloud compute forwarding-rules delete $SERVICE-http-rule --global 

gcloud compute target-http-proxies delete $SERVICE-proxy 

gcloud compute url-maps delete $SERVICE-map 

gcloud compute backend-services delete $SERVICE 

gcloud compute http-health-checks delete ah-health-check

gcloud compute instance-groups managed delete $GROUP  

gcloud compute instance-templates delete $TEMPLATE 

gcloud compute firewall-rules delete default-allow-http-8080