import {
  BuildType,
  OUTPUT_DIR,
} from "../../../../src/core/types/package-config.ts";
import { runPackageAction } from "../../../../src/commands/packages.ts";

import { resolve, join } from "node:path";
import { argv } from "node:process";

export const build = (cwd: string = process.cwd()): BuildType => {
  const TOOLCHAINS = resolve(cwd, "../../../toolchains/cmake-tools");
  // const toolchain_clang = resolve(
  // 	cwd,
  // 	"../../../toolchains/dependencies/clang"
  // );
  const toolchain_clang = resolve(cwd, "../../../toolchains/windows.x86_64");
  const win_sysroot = resolve(cwd, "../../../toolchains/windows.x86_64");
  const win_aarch64_sysroot = resolve(
    cwd,
    "../../../toolchains/windows.aarch64"
  );
  const linux_sysroot = resolve(cwd, "../../../toolchains/linux.x86_64");
  const linux_aarch64_sysroot = resolve(
    cwd,
    "../../../toolchains/linux.aarch64"
  );
  const CLANG = join(toolchain_clang, "bin/clang.exe").replace(/\\/g, "/");
  const CLANGXX = join(toolchain_clang, "bin/clang++.exe").replace(/\\/g, "/");
  const CLANG_AARCH64 = join(
    toolchain_clang,
    "bin/aarch64-w64-mingw32-clang.exe"
  ).replace(/\\/g, "/");
  const CLANGXX_AARCH64 = join(
    toolchain_clang,
    "bin/aarch64-w64-mingw32-clang++.exe"
  ).replace(/\\/g, "/");

  return {
    type: "architectures",
    windows_x86_64: {
      configStep: `cmake -S ./build/cmake -B dist/windows/x86_64 -G Ninja \
			-DCMAKE_TOOLCHAIN_FILE=${TOOLCHAINS}/windows_x86-64.cmake \
			-DCMAKE_SYSROOT=${win_sysroot} \
      		-DCMAKE_BUILD_TYPE=Release \
      		-DBUILD_SHARED_LIBS=OFF \
      		-DCMAKE_C_COMPILER=${CLANG} \
      		-DCMAKE_CXX_COMPILER=${CLANGXX} \
      		-DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
      		-DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
			-DCMAKE_INCLUDE_PATH=${win_sysroot}/include \
      		-DCMAKE_PREFIX_PATH=${OUTPUT_DIR}/zstd/windows/x86_64 \
      		-DCMAKE_INSTALL_PREFIX=${OUTPUT_DIR}/zstd/windows/x86_64
      		`,
      buildStep: `cmake --build dist/windows/x86_64 -j`,
      installStep: `cmake --install dist/windows/x86_64`,
    },
    windows_aarch64: {
      configStep: `cmake -S ./build/cmake -B dist/windows/aarch64 -G Ninja \
	  		-DCMAKE_TOOLCHAIN_FILE=${TOOLCHAINS}/windows_aarch64.cmake \
			-DCMAKE_SYSROOT=${win_aarch64_sysroot} \
		  	-DCMAKE_BUILD_TYPE=Release \
		  	-DBUILD_SHARED_LIBS=OFF \
		  	-DCMAKE_C_COMPILER=${CLANG_AARCH64} \
		  	-DCMAKE_CXX_COMPILER=${CLANGXX_AARCH64} \
		  	-DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
		  	-DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
		  	-DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
			-DCMAKE_INCLUDE_PATH=${win_aarch64_sysroot}/include \
		  	-DCMAKE_PREFIX_PATH=${OUTPUT_DIR}/zstd/windows/aarch64 \
		  	-DCMAKE_INSTALL_PREFIX=${OUTPUT_DIR}/zstd/windows/aarch64
		  	`,
      buildStep: `cmake --build dist/windows/aarch64 -j`,
      installStep: `cmake --install dist/windows/aarch64`,
    },
    linux_x86_64: {
      configStep: `cmake -S ./build/cmake -B dist/linux/x86_64 -G Ninja \
		  	-DCMAKE_TOOLCHAIN_FILE=${TOOLCHAINS}/linux_x86-64.cmake \
			-DCMAKE_SYSROOT=${linux_sysroot} \
		  	-DCMAKE_BUILD_TYPE=Release \
		  	-DBUILD_SHARED_LIBS=OFF \
		  	-DCMAKE_C_COMPILER=${CLANG} \
		  	-DCMAKE_CXX_COMPILER=${CLANGXX} \
		  	-DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu \
		  	-DCMAKE_CXX_COMPILER_TARGET=x86_64-unknown-linux-gnu \
		  	-DCMAKE_PREFIX_PATH=${OUTPUT_DIR}/zstd/linux/x86_64 \
		  	-DCMAKE_INSTALL_PREFIX=${OUTPUT_DIR}/zstd/linux/x86_64
		  	`,
      buildStep: `cmake --build dist/linux/x86_64 -j`,
      installStep: `cmake --install dist/linux/x86_64`,
    },
    linux_aarch64: {
      configStep: `cmake -S ./build/cmake -B dist/linux/aarch64 -G Ninja \
		  	-DCMAKE_TOOLCHAIN_FILE=${TOOLCHAINS}/linux_aarch64.cmake \
			-DCMAKE_SYSROOT=${linux_aarch64_sysroot} \
		  	-DCMAKE_BUILD_TYPE=Release \
		  	-DBUILD_SHARED_LIBS=OFF \
		  	-DCMAKE_C_COMPILER=${CLANG} \
		  	-DCMAKE_CXX_COMPILER=${CLANGXX} \
		  	-DCMAKE_C_COMPILER_TARGET=aarch64-unknown-linux-gnu \
		  	-DCMAKE_CXX_COMPILER_TARGET=aarch64-unknown-linux-gnu \
		  	-DCMAKE_PREFIX_PATH=${OUTPUT_DIR}/zstd/linux/aarch64 \
		  	-DCMAKE_INSTALL_PREFIX=${OUTPUT_DIR}/zstd/linux/aarch64
		  	`,
      buildStep: `cmake --build dist/linux/aarch64 -j`,
      installStep: `cmake --install dist/linux/aarch64`,
    },
  } satisfies BuildType;
};

const args = argv.slice(2);
const [action = "help"] = args;

await runPackageAction(action, process.cwd(), build());
