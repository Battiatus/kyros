                +------------+        +-------------+
Front Web / Mobile  <--API-->  Gateway  <->  Services métier
(React / RN)        (Node)                (Node ctx.)
                +------------+        +-------------+

             +--- Chat/RTC ---+   +----- Matching/ML -----+
             |                |   |                       |
             v                v   v                       v
        MongoDB (données)   Redis (cache)   S3 (assets)   Stripe
