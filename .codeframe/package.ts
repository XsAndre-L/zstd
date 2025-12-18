import {
  BuildType,
  CPP_OUTPUT_DIR,
  runPackageAction,
  CMAKE_TOOLS,
  getHostSysrootPath,
  SYSROOT,
} from "../../../../src/providers/package.privider.ts";

import { join } from "node:path";
import { argv } from "node:process";

export const build = (cwd: string = process.cwd()): BuildType => {
  const { windows_x86_64, windows_aarch64, linux_x86_64, linux_aarch64 } =
    SYSROOT;

  const HOST_SYSROOT = getHostSysrootPath();
  const CLANG = join(HOST_SYSROOT, "bin/clang.exe").replace(/\\/g, "/");
  const CLANGXX = join(HOST_SYSROOT, "bin/clang++.exe").replace(/\\/g, "/");

  return {
    type: "architectures",
    windows_x86_64: {
      configStep: `cmake -S ./build/cmake -B dist/windows/x86_64 -G Ninja \
			    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/windows_x86-64.cmake \
			    -DCMAKE_SYSROOT=${windows_x86_64} \
      		-DCMAKE_BUILD_TYPE=Release \
      		-DBUILD_SHARED_LIBS=OFF \
      		-DCMAKE_C_COMPILER=${CLANG} \
      		-DCMAKE_CXX_COMPILER=${CLANGXX} \
      		-DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
      		-DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
			    -DCMAKE_INCLUDE_PATH=${windows_x86_64}/include \
      		-DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zstd/windows/x86_64 \
      		-DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zstd/windows/x86_64
      		`,
      buildStep: `cmake --build dist/windows/x86_64 -j`,
      installStep: `cmake --install dist/windows/x86_64`,
    },
    windows_aarch64: {
      configStep: `cmake -S ./build/cmake -B dist/windows/aarch64 -G Ninja \
	  		-DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/windows_aarch64.cmake \
			  -DCMAKE_SYSROOT=${windows_aarch64} \
		  	-DCMAKE_BUILD_TYPE=Release \
		  	-DBUILD_SHARED_LIBS=OFF \
		  	-DCMAKE_C_COMPILER=${CLANG} \
		  	-DCMAKE_CXX_COMPILER=${CLANGXX} \
		  	-DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
		  	-DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
		  	-DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
			  -DCMAKE_INCLUDE_PATH=${windows_aarch64}/include \
		  	-DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zstd/windows/aarch64 \
		  	-DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zstd/windows/aarch64
		  	`,
      buildStep: `cmake --build dist/windows/aarch64 -j`,
      installStep: `cmake --install dist/windows/aarch64`,
    },
    linux_x86_64: {
      configStep: `cmake -S ./build/cmake -B dist/linux/x86_64 -G Ninja \
		  	-DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_x86-64.cmake \
			  -DCMAKE_SYSROOT=${linux_x86_64} \
		  	-DCMAKE_BUILD_TYPE=Release \
		  	-DBUILD_SHARED_LIBS=OFF \
		  	-DCMAKE_C_COMPILER=${CLANG} \
		  	-DCMAKE_CXX_COMPILER=${CLANGXX} \
		  	-DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu \
		  	-DCMAKE_CXX_COMPILER_TARGET=x86_64-unknown-linux-gnu \
		  	-DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zstd/linux/x86_64 \
		  	-DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zstd/linux/x86_64
		  	`,
      buildStep: `cmake --build dist/linux/x86_64 -j`,
      installStep: `cmake --install dist/linux/x86_64`,
    },
    linux_aarch64: {
      configStep: `cmake -S ./build/cmake -B dist/linux/aarch64 -G Ninja \
		  	-DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_aarch64.cmake \
			  -DCMAKE_SYSROOT=${linux_aarch64} \
		  	-DCMAKE_BUILD_TYPE=Release \
		  	-DBUILD_SHARED_LIBS=OFF \
		  	-DCMAKE_C_COMPILER=${CLANG} \
		  	-DCMAKE_CXX_COMPILER=${CLANGXX} \
		  	-DCMAKE_C_COMPILER_TARGET=aarch64-unknown-linux-gnu \
		  	-DCMAKE_CXX_COMPILER_TARGET=aarch64-unknown-linux-gnu \
		  	-DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/zstd/linux/aarch64 \
		  	-DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/zstd/linux/aarch64
		  	`,
      buildStep: `cmake --build dist/linux/aarch64 -j`,
      installStep: `cmake --install dist/linux/aarch64`,
    },
  } satisfies BuildType;
};

const args = argv.slice(2);
const [action = "help"] = args;

await runPackageAction(action, process.cwd(), build());
