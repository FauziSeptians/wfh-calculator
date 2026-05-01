import { ApiResponse } from '@/utils/apiResponse';
import { WfhCalculator } from '@/utils/wfhCalculator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate, anchorDate, customLeaves = [] } = body;

    if (!startDate || !endDate || !anchorDate) {
      return ApiResponse.error(
        null,
        'startDate, endDate, dan anchorDate wajib diisi',
        400
      );
    }

    const calculator = new WfhCalculator();
    const schedule = await calculator.generateSchedule(
      startDate,
      endDate,
      anchorDate,
      customLeaves
    );

    return ApiResponse.success({ schedule }, 'Jadwal berhasil dihitung', 200);
  } catch (error: any) {
    return ApiResponse.error(null, 'Terjadi kesalahan server', 500);
  }
}
