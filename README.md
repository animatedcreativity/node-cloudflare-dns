# node-cloudflare-dns

Super simple way to manage Cloudflare DNS entries domainwise. No need to get into the hassle of Zone or DNS IDs.  
Now supports Key-Value namespaces.

**Usage:**

```
var cloudflare = require("node-cloudflare-dns")({
  email: "email@domain.com",
  key: "<cloudflare_api_key>",
  account: "<account_id>" // can be taken from cloudflare account link, needed for Key-Value namespaces only.
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
cloudflare.dns.record("domain.com", "<subdomain>");
```

- Gets a DNS record for a subdomain, if there are multiple entries with same name will get the first one.

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

------------------------------------------

## key-Value Namespaces

```
cloudflare.kv.namespace.list();
```

- Get Key-value namespaces list.

```
cloudflare.kv.namespace.get(namespace);
```

- Get a Key-value namespace by name.

```
cloudflare.kv.get(namespace, key);
```

- Get a key's value from provided namespace.

```
cloudflare.kv.set(namespace, key, value);
```

- Set a key's value in provided namespace.

```
cloudflare.kv.delete(namespace, key);
```

- Delete a key from provided namespace.