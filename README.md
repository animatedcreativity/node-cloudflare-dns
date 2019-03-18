# node-cloudflare-dns

Super simple way to manage Cloudflare DNS entries domainwise. No need to get into the hassle of Zone or DNS IDs.

**Usage:**

```
var cloudflare = require("node-cloudflare-dns")({
  email: "email@domain.com",
  key: "<cloudflare_api_key>"
});
var record = {type: "A", name: "test", content: "<ip_address>", proxied: true};
cloudflare.dns.add("domain.com", record);
```

For more information on DNS records, check: https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record

------------------------------------------------

**Methods:** (All methods return promise).

```
cloudflare.dns.list("domain.com");
```

- Lists all DNS records inside a domain.

```
cloudflare.dns.add("domain.com", {type: "A", name: "test", content: "<ip_address>", proxied: true});
```

- Makes a new DNS entry.

```
cloudflare.dns.delete("domain.com", {type: "A", name: "test.domain.com"});
```

- Deletes existing DNS entry.
- WARNING: This is a very powerful delete and works on the basis of the query provided. For example: just `{type: "A"}` will remove all the `A` records for that domain. Please use more precise delete queries.

```
cloudflare.zones();
```

- Lists all the zones available under that Cloudflare account.

```
cloudflare.zone("domain.com");
```

- Get a particular domain's zone.