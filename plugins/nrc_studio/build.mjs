import { context, build } from "esbuild";

const isWatch = process.argv.includes("--watch");

const options = {
  entryPoints: ["./src/index.js"],
  outfile: "./nrc_studio.js",
  bundle: true,
  format: "iife",
  external: ["three"],
};

if (isWatch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("[nrc_studio] watching for changes...");
} else {
  await build(options);
  console.log("[nrc_studio] build complete");
}
