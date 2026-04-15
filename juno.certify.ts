import { defineRun } from "@junobuild/config";
import type { SatelliteDid } from "@junobuild/ic-client/actor";
import { fromNullable, nonNullish, toNullable } from "@dfinity/utils";
import { Actor, ActorSubclass, HttpAgent } from "@icp-sdk/core/agent";
import {
  idlFactorySatellite,
  type SatelliteActor,
} from "@junobuild/ic-client/actor";

export const onRun = defineRun(({ mode }) => ({
  run: async ({ satelliteId, identity, container }) => {
    const agent = await HttpAgent.create({
      identity,
      host: container,
      shouldFetchRootKey: mode === "development",
    });

    const actor: ActorSubclass<SatelliteActor> = await Actor.createActor(
      idlFactorySatellite,
      {
        agent,
        canisterId: satelliteId,
      },
    );

    console.log("Certifying heap assets...");

    await certifyChunks({
      actor,
      cursor: { Heap: { offset: 0n } },
      strategy: { Clear: null },
    });

    console.log("Heap done.");

    console.log("Certifying stable assets...");

    await certifyChunks({
      actor,
      cursor: { Stable: { key: [] } },
      strategy: { AppendWithRouting: null },
    });

    console.log("Stable done.");
  },
}));

const certifyChunks = async ({
  actor,
  cursor,
  strategy,
  appendStrategy = { AppendWithRouting: null },
  chunk = 0,
}: {
  actor: SatelliteActor;
  cursor: SatelliteDid.CertifyAssetsCursor;
  strategy: SatelliteDid.CertifyAssetsStrategy;
  appendStrategy?: SatelliteDid.CertifyAssetsStrategy;
  chunk?: number;
}) => {
  const { certify_assets_chunk } = actor;

  console.log(`  Chunk ${chunk}...`);

  const result = await certify_assets_chunk({
    cursor,
    chunk_size: toNullable(), // default to 1000
    strategy,
  });

  const next = fromNullable(result.next_cursor);

  if (nonNullish(next)) {
    await certifyChunks({
      actor,
      cursor: next,
      strategy: appendStrategy,
      chunk: chunk + 1,
    });
  }
};
